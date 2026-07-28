function template(params) {
  // course_title, wallet_address, nft_contract, nft_id) {
  return `
Note: Abaixo você encontrará mais informações em português.
<br>
Hello builder 👷👷‍♀️!<br>
<br>
You have just received your NFT for completing the bootcamp <b>${params.course_title}</b>! It's already in your wallet <a href='https://solscan.io/account/${params.wallet_address}'>${params.wallet_address}</a>.<br>
<br>
You can already see your NFT on <a href='https://solscan.io/token/${params.nft_id}'>Solscan.</a><br>
<br>
Take advantage of this moment to show the world what you've achieved!!! Go on Twitter and tag <a href='https://twitter.com/web3dev_'>@web3dev_ </a>with your NFT screenshot, I'm sure it will look great!<br>
<br>
See <a href='https://pt.w3d.community/nomadbitcoin/using-nft-certificates-on-linkedin-4hld'>how to add your certificate to linkedin.</a><br>
<br>
This helps us spread the word about our bootcamps to other people like you who want to learn more about Web3 :)<br>
<br>
I'm happy with your certification, congratulations! See you at the next bootcamp!<br>
<br>
Cheers,<br>
Yan Luiz<br>
<br>
<hr>
Olá builder 👷👷‍♀️!<br>
<br>
Você acabou de receber seu NFT por completar o bootcamp <b>${params.course_title}</b>! Ele já está na sua carteira <a href='https://solscan.io/account/${params.wallet_address}'>${params.wallet_address}</a>.<br>
<br>
Você já pode ver seu NFT no <a href='https://solscan.io/token/${params.nft_id}'>Solscan.</a><br>
<br>
Aproveite este momento para mostrar ao mundo o que você conquistou!!! Vá ao Twitter e marque <a href='https://twitter.com/web3dev_'>@web3dev_ </a>com a captura de tela do seu NFT, tenho certeza de que ficará ótimo!<br>
<br>
Veja <a href='https://pt.w3d.community/dione_b/utilizando-nfts-como-certificado-no-linkedin-31ce<br'>como adicionar seu certificado ao LinkedIn.</a><br>
<br>
Isso nos ajuda a divulgar nossos bootcamps para outras pessoas como você que querem aprender mais sobre Web3 :)<br>
<br>
Estou muito feliz com sua certificação, parabéns! Vejo você no próximo bootcamp!<br>
<br>
Grande Abraço,<br>
Yan Luiz<br>
<br>`
}

module.exports = template
