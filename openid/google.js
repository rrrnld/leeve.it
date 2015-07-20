var https = require('https')
var fs = require('fs')
var jwk2pem = require('pem-jwk').jwk2pem

/**
 * This module is used to fetch google's JWK. As they are in JWK fomart, but need
 * to be in PEM in order to be accepted by the `jsonwebtoken` module, they are
 * also converted and saved to the file `.keys.google.json` afterwards.
 *
 * @module
 */
module.exports = {

  retrieve: function (done) {
    // Example response:
    // {
    //     "issuer": "https://accounts.google.com",
    //     "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
    //     "token_endpoint": "https://www.googleapis.com/oauth2/v4/token",
    //     "userinfo_endpoint": "https://www.googleapis.com/oauth2/v3/userinfo",
    //     "revocation_endpoint": "https://accounts.google.com/o/oauth2/revoke",
    //     "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
    //     "response_types_supported":
    //     [
    //         "code",
    //         "token",
    //         "id_token",
    //         "code token",
    //         "code id_token",
    //         "token id_token",
    //         "code token id_token",
    //         "none"
    //     ],
    //     "subject_types_supported":
    //     [
    //         "public"
    //     ],
    //     "id_token_signing_alg_values_supported":
    //     [
    //         "RS256"
    //     ],
    //     "scopes_supported":
    //     [
    //         "openid",
    //         "email",
    //         "profile"
    //     ],
    //     "token_endpoint_auth_methods_supported":
    //     [
    //         "client_secret_post",
    //         "client_secret_basic"
    //     ],
    //     "claims_supported":
    //     [
    //         "aud",
    //         "email",
    //         "email_verified",
    //         "exp",
    //         "family_name",
    //         "given_name",
    //         "iat",
    //         "iss",
    //         "locale",
    //         "name",
    //         "picture",
    //         "sub"
    //     ]
    // }
    var getKeyUrls = function getKeyUrls (cb) {
      https.get('https://accounts.google.com/.well-known/openid-configuration', function (res) {
        if (res.statusCode !== 200) {
          console.error('Bad response during Google OpenID discovery')
          console.error('satuscode:', res.statusCode)
          console.error('headers:  ', res.headers)
        }

        var buffer = ''
        res.on('data', function (data) {
          buffer += data
        })
        res.on('end', function () {
          var response = JSON.parse(buffer)
          cb(response.jwks_uri)
        })
      }).on('error', console.error.bind(console))
    }

    // Example Response:
    // {
    //     "keys":
    //     [
    //         {

    //             "kty": "RSA",
    //             "alg": "RS256",
    //             "use": "sig",
    //             "kid": "e53139984bd36d2c230552441608cc0b5179487a",
    //             "n": "w5F_3au2fyRLapW4K1g0zT6hjF-co8hjHJWniH3aBOKP45xuSRYXnPrpBHkXM6jFkVHs2pCFAOg6o0tl65iRCcf3hOAI6VOIXjMCJqxNap0-j_lJ6Bc6TBKgX3XD96iEI92iaxn_UIVZ_SpPrbPVyRmH0P7B6oDkwFpApviJRtQzv1F6uyh9W_sNnEZrCZDcs5lL5Xa_44-EkhVNz8yGZmAz9d04htNU7xElmXKs8fRdospyv380WeaWFoNJpc-3ojgRus26jvPy8Oc-d4M5yqs9mI72-1G0zbGVFI_PfxZRL8YdFAIZLg44zGzL2M7pFmagJ7Aj46LUb3p_n9V1NQ",
    //             "e": "AQAB"
    //         },
    //         {
    //             "kty": "RSA",
    //             "alg": "RS256",
    //             "use": "sig",
    //             "kid": "bc8a31927af20860418f6b2231bbfd7ebcc04665",
    //             "n": "ucGr4fFCJYGVUwHYWAtBNclebyhMjALOTUmmAXdMrCIOgT8TxBEn5oXCrszWX7RoC37nFqc1GlMorfII19qMwHdC_iskju3Rh-AuHr29zkDpYIuh4lRW0xJ0Xyo2Iw4PlV9qgqPJLfkmE5V-sr5RxZNe0T1jyYaOGIJ5nF3WbDkgYW4GNHXhv-5tOwWLThJRtH_n6wtYqsBwqAdVX-EVbkyZvYeOzbiNiop7bDM5Td6ER1oCBC4NZjvjdmnOh8-_x6vB449jL5IRAOIIv8NW9dLtQd2DescZOw46HZjWO-zwyhjQeYY87R93yM9yivJdfrjQxydgEs8Ckh03NDATmQ",
    //             "e": "AQAB"
    //         }
    //     ]
    // }
    var getKeys = function getKeys (url) {
      https.get(url, function (res) {
        if (res.statusCode !== 200) {
          console.error('Bad response during Google OpenID discovery')
          console.error('satuscode:', res.statusCode)
          console.error('headers:  ', res.headers)
        }

        var path = process.cwd() + '/.keys.google.json'
        var writeStream = fs.createWriteStream(path)
        writeStream.on('end', function () {
          done(url, path)
        })

        var buffer = ''
        res.on('data', function (data) {
          buffer += data
        })
        res.on('end', function () {
          // transform the keys to PEM format because jsonwebtokens expects this
          var data = JSON.parse(buffer)
          var keys = {}
          data.keys.forEach(function (key) {
            keys[key.kid] = jwk2pem(key)
          })

          writeStream.write(JSON.stringify(keys))
          writeStream.end()
        })
      })
    }

    getKeyUrls(getKeys)
  }

}
