/**
 * TEAM Sahélia — Module Cryptographique W3C Open Badges 3.0 & Verifiable Credentials
 * Vérification mathématique en direct dans le navigateur via Web Cryptography API (ECDSA P-256 / SHA-256)
 * Format standard : JsonWebSignature2020 / RFC 7797 (Detached JWS Payload)
 * Zéro dépendance externe — Compatible 100% navigateurs modernes & GitHub Pages.
 */

(function () {
  'use strict';

  // Clé publique officielle de TEAM Sahélia (Format JWK standard)
  const CLE_PUBLIQUE_OFFICIELLE = {
    "kty": "EC",
    "x": "mZiMK_9HVI-ZBxgdciSK_TrO7aUzrVu5XBiLLxXBZTY",
    "y": "bPaVtwZaWquSLXz1FDePI2Me_1fp--R8TudNQignUCs",
    "crv": "P-256"
  };

  /**
   * Base64URL Encodage & Décodage (Conforme RFC 7515 / RFC 7797)
   */
  function base64urlEncode(octets) {
    let b64 = '';
    if (typeof Buffer !== 'undefined') {
      b64 = Buffer.from(octets).toString('base64');
    } else {
      let binary = '';
      const bytes = new Uint8Array(octets);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      b64 = btoa(binary);
    }
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  function base64urlDecode(str) {
    let b64 = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Convertit une chaîne hexadécimale en Uint8Array (Repli rétrocompatible)
   */
  function hexVersUint8(hexString) {
    const propre = hexString.replace(/[^0-9a-fA-F]/g, '');
    const octets = new Uint8Array(propre.length / 2);
    for (let i = 0; i < propre.length; i += 2) {
      octets[i / 2] = parseInt(propre.substr(i, 2), 16);
    }
    return octets;
  }

  /**
   * Canonicalisation déterministe d'un objet JSON (Tri récursif strict des clés)
   */
  function canonicaliserObjet(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(canonicaliserObjet);
    }
    const trie = {};
    Object.keys(obj).sort().forEach(cle => {
      trie[cle] = canonicaliserObjet(obj[cle]);
    });
    return trie;
  }

  /**
   * Calcul du hash SHA-256 hexadécimal (Web Crypto API)
   */
  async function calculerSha256Hex(texte, cryptoSubtle) {
    const donnees = new TextEncoder().encode(texte);
    const hashBuf = await cryptoSubtle.digest('SHA-256', donnees);
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Vérifie la signature cryptographique d'un Verifiable Credential W3C
   * Protège à la fois le corps du credential ET les métadonnées de la preuve (created, verificationMethod, proofPurpose).
   */
  async function verifierSignatureCredential(credential, clePubliqueJwk = null) {
    if (!credential || typeof credential !== 'object') {
      return { valide: false, erreur: 'Document justificatif vide ou format JSON invalide.' };
    }

    if (!credential.proof || typeof credential.proof !== 'object') {
      return { valide: false, nonSigne: true, erreur: 'Absence de preuve cryptographique (bloc "proof" manquant).' };
    }

    const proof = credential.proof;
    const cryptoSubtle = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
      ? window.crypto.subtle
      : (typeof global !== 'undefined' && global.window && global.window.crypto && global.window.crypto.subtle ? global.window.crypto.subtle : null);

    if (!cryptoSubtle) {
      return { valide: false, erreur: 'API Web Cryptography non disponible dans cet environnement d’exécution.' };
    }

    const jwk = clePubliqueJwk || CLE_PUBLIQUE_OFFICIELLE;

    try {
      // 1. Contrôle du support de format : standard JsonWebSignature2020 avec detached JWS ou signatureValue
      const aJws = typeof proof.jws === 'string' && proof.jws.includes('..');
      const aSigValue = typeof proof.signatureValue === 'string';

      if (!aJws && !aSigValue) {
        return { valide: false, erreur: 'Format de preuve non reconnu (absence de propriété jws ou signatureValue valide).' };
      }

      // 2. Importer la clé publique ECDSA P-256
      const cleImportee = await cryptoSubtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      // CAS A : Format Standard Detached JWS (RFC 7797 / W3C JsonWebSignature2020)
      if (aJws) {
        const parts = proof.jws.split('..');
        const headerB64 = parts[0];
        const signatureB64 = parts[1];
        const signatureOctets = base64urlDecode(signatureB64);

        if (signatureOctets.length !== 64) {
          return { valide: false, erreur: `Signature ECDSA invalide (${signatureOctets.length} octets au lieu de 64).` };
        }

        // Canonicaliser le document (sans proof)
        const copieDoc = JSON.parse(JSON.stringify(credential));
        delete copieDoc.proof;
        const docCanonique = JSON.stringify(canonicaliserObjet(copieDoc));
        const docHash = await calculerSha256Hex(docCanonique, cryptoSubtle);

        // Canonicaliser la configuration de preuve (created, verificationMethod, proofPurpose)
        const proofConfig = {
          type: proof.type || 'JsonWebSignature2020',
          created: proof.created,
          verificationMethod: proof.verificationMethod,
          proofPurpose: proof.proofPurpose || 'assertionMethod'
        };
        const proofCanonique = JSON.stringify(canonicaliserObjet(proofConfig));
        const proofHash = await calculerSha256Hex(proofCanonique, cryptoSubtle);

        // Données complètes signées : headerB64 + '.' + docHash + ':' + proofHash
        const payloadSigne = `${docHash}:${proofHash}`;
        const donneesAVerifier = new TextEncoder().encode(`${headerB64}.${payloadSigne}`);

        const signatureValide = await cryptoSubtle.verify(
          { name: 'ECDSA', hash: { name: 'SHA-256' } },
          cleImportee,
          signatureOctets,
          donneesAVerifier
        );

        if (!signatureValide) {
          return {
            valide: false,
            erreur: 'Signature cryptographique non concordante : le document ou ses métadonnées de preuve ont été altérés après émission.'
          };
        }

        return {
          valide: true,
          standard: 'W3C JsonWebSignature2020 (RFC 7797)',
          dateSignature: proof.created,
          methode: proof.verificationMethod,
          emetteur: credential.issuer
        };
      }

      // CAS B : Repli Legacy signatureValue (Hex)
      const signatureOctets = hexVersUint8(proof.signatureValue);
      if (signatureOctets.length !== 64) {
        return { valide: false, erreur: `Format de signature legacy invalide (${signatureOctets.length} octets au lieu de 64).` };
      }

      const copie = JSON.parse(JSON.stringify(credential));
      delete copie.proof;
      const texteSigne = JSON.stringify(canonicaliserObjet(copie));
      const donneesOctets = new TextEncoder().encode(texteSigne);

      const legacyValide = await cryptoSubtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        cleImportee,
        signatureOctets,
        donneesOctets
      );

      if (!legacyValide) {
        return { valide: false, erreur: 'Signature legacy non concordante : document altéré.' };
      }

      return {
        valide: true,
        standard: 'Legacy Raw ECDSA P-256',
        dateSignature: proof.created,
        methode: proof.verificationMethod,
        emetteur: credential.issuer
      };

    } catch (e) {
      return { valide: false, erreur: `Erreur d'exécution du contrôle cryptographique : ${e.message}` };
    }
  }

  /**
   * Vérifie le statut de révocation auprès du registre public officiel
   * Logique stricte à 3 états (Fail-Closed) :
   * - VALIDE : Le registre a été contacté avec succès et l'identifiant n'y figure pas.
   * - REVOQUE / SUSPENDU : Le titre est officiellement invalidé ou suspendu.
   * - STATUT_INCONNU : Registre inaccessible (erreur réseau / hors-ligne). Ne jamais présumer de validité !
   */
  async function verifierStatutRevocation(credentialId) {
    if (!credentialId) {
      return { statut: 'STATUT_INCONNU', revoque: null, erreur: 'Identifiant manquant.' };
    }

    const cleanId = String(credentialId).trim().toUpperCase();

    try {
      const resp = await fetch('status/revocations.json');
      if (!resp.ok) {
        return {
          statut: 'STATUT_INCONNU',
          revoque: null,
          erreur: `Registre de révocation inaccessible (Code HTTP ${resp.status}).`
        };
      }

      const registre = await resp.json();

      // 1. Contrôle des révocations définitives
      const matchRevoc = (registre.revocations || []).find(r => r.id && String(r.id).trim().toUpperCase() === cleanId);
      if (matchRevoc) {
        return {
          statut: 'REVOQUE',
          revoque: true,
          date: matchRevoc.date,
          motif: matchRevoc.motif || 'Révocation administrative définitive'
        };
      }

      // 2. Contrôle des suspensions temporaires
      const matchSusp = (registre.suspensions || []).find(s => s.id && String(s.id).trim().toUpperCase() === cleanId);
      if (matchSusp) {
        return {
          statut: 'SUSPENDU',
          revoque: true,
          date: matchSusp.date,
          motif: matchSusp.motif || 'Suspension administrative temporaire'
        };
      }

      // 3. Registre contrôlé avec succès et titre non révoqué
      return {
        statut: 'VALIDE',
        revoque: false,
        derniereMiseAJour: registre.derniereMiseAJour
      };

    } catch (e) {
      return {
        statut: 'STATUT_INCONNU',
        revoque: null,
        erreur: `Impossible de joindre le registre de révocation (hors-ligne ou réseau indisponible : ${e.message}).`
      };
    }
  }

  // Export global
  window.BadgeCrypto = {
    CLE_PUBLIQUE_OFFICIELLE,
    base64urlEncode,
    base64urlDecode,
    canonicaliserObjet,
    verifierSignatureCredential,
    verifierStatutRevocation
  };
})();
