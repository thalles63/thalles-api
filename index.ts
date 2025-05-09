import app from "./src/app";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// // const express = require("express");
// const {
//   exchangeNpssoForAccessCode,
//   exchangeAccessCodeForAuthTokens,
// } = require("psn-api");
// // const app = express();

// async function teste() {
//   const myNpsso =
//     "dqYJVKd0Ng8YPAPCEvPGxtoiz1KGh9O76zC62S7DTAC2yS309RSHaeNVRLAXL87W";
//   const accessCode = await exchangeNpssoForAccessCode(myNpsso);
//   const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

//   console.log(authorization);
// }

// teste();
// // app.get('/api/psn/trophies/:titleId', async (req, res) => {
// //   try {

// //     // // Autentica e obtém access token (cachê-lo em produção)
// //     // const { code, access_token } = await authenticate({ npSSO: 'SEU_NPSSO' });
// //     // // Obtem troféus conquistados para o título especificado
// //     // const data = await getUserTrophiesEarnedForTitle(
// //     //   { accessToken: access_token },
// //     //   'me',
// //     //   req.params.titleId,
// //     //   'all'
// //     // );
// //     // res.json(data);
// //   } catch(err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
