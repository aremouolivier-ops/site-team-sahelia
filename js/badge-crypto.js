/**
 * TEAM Sahélia — Module Cryptographique W3C Open Badges 3.0 & Verifiable Credentials
 * Vérification mathématique en direct dans le navigateur via l'API Web Cryptography (ECDSA P-256)
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
   * Canonicalisation déterministe d'un objet JSON (Tri récursif des clés)
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
   * Convertit une chaîne hexadécimale en Uint8Array
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
   * Vérifie la signature cryptographique d'un Verifiable Credential W3C
   */
  async function verifierSignatureCredential(credential, clePubliqueJwk = null) {
    if (!credential || typeof credential !== 'object') {
      return { valide: false, erreur: 'Document justificatif invalide ou vide.' };
    }

    if (!credential.proof || !credential.proof.signatureValue) {
      return { valide: false, erreur: 'Absence de preuve cryptographique (proof manquante).' };
    }

    const proof = credential.proof;
    const jwk = clePubliqueJwk || CLE_PUBLIQUE_OFFICIELLE;

    try {
      // 1. Reconstruire la charge utile signée (sans le bloc proof)
      const copie = JSON.parse(JSON.stringify(credential));
      delete copie.proof;
      const objetCanonique = canonicaliserObjet(copie);
      const texteSigne = JSON.stringify(objetCanonique);
      const donneesOctets = new TextEncoder().encode(texteSigne);

      // 2. Extraire la signature IEEE P1363 (64 octets)
      const signatureOctets = hexVersUint8(proof.signatureValue);
      if (signatureOctets.length !== 64) {
        return { valide: false, erreur: `Format de signature ECDSA invalide (${signatureOctets.length} octets au lieu de 64).` };
      }

      // 3. Importer la clé publique dans Web Crypto API
      const cryptoSubtle = window.crypto && window.crypto.subtle ? window.crypto.subtle : null;
      if (!cryptoSubtle) {
        return { valide: false, erreur: 'API Web Cryptography non supportée sur ce navigateur.' };
      }

      const cleImportee = await cryptoSubtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      // 4. Exécuter la vérification mathématique
      const signatureValide = await cryptoSubtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        cleImportee,
        signatureOctets,
        donneesOctets
      );

      if (!signatureValide) {
        return {
          valide: false,
          erreur: 'Signature cryptographique non concordante : le document a été modifié après son émission !'
        };
      }

      return {
        valide: true,
        dateSignature: proof.created,
        methode: proof.verificationMethod,
        emetteur: credential.issuer
      };
    } catch (e) {
      return { valide: false, erreur: `Erreur d'audit cryptographique : ${e.message}` };
    }
  }

  /**
   * Vérifie le statut de révocation auprès du registre public
   */
  async function verifierStatutRevocation(credentialId) {
    try {
      const resp = await fetch('status/revocations.json');
      if (!resp.ok) return { revoque: false };
      const registre = await resp.json();
      const match = (registre.revocations || []).find(r => r.id === credentialId);
      if (match) {
        return {
          revoque: true,
          motif: match.motif || 'Révocation administrative',
          date: match.date
        };
      }
      return { revoque: false };
    } catch (e) {
      return { revoque: false };
    }
  }

  // Export global
  window.BadgeCrypto = {
    CLE_PUBLIQUE_OFFICIELLE,
    canonicaliserObjet,
    verifierSignatureCredential,
    verifierStatutRevocation
  };
})();
