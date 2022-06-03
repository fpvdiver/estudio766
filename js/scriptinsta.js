$(function(){

    const token = "{{secrets.INSTA_TOKEN_SECURITY}}";
    const url = "https://graph.instagram.com/me/media?access_token=" + token + "&fields=media_url,media_type,caption,permalink";

    $.get(url).then(function(response){

        console.log('retorno: ', response.data);

        let dadosJson = response.data
        let conteudo = '<div class="row">';

        for (let p = 0; p < 6 ; p++) {
            let feed = dadosJson[p];
            let titulo = feed.caption !== null ? feed.caption : '';
            let tipo = feed.media_type;
            if(tipo === 'VIDEO'){ 
                conteudo += '<div class="col-6 col-md-4" controls><source src="'+feed.media_url+'" type="video/mp4></video></div>';
            }if(tipo === 'CAROUSEL_ALBUM'){
                conteudo += '<div class="col-6 col-md-4 mb-3"><img src="'+feed.media_url+'" class="d-block w-100" alt="Second slide"></div>';
            }
             else if (tipo === 'IMAGE') {
                conteudo += ' <div class="col-6 col-md-4 mb-3" ><img src="'+feed.media_url+'" class="d-block w-100" alt="First slide"></div>';
                }        
        }
        conteudo += '</div>';
        $('#insta').html(conteudo);
    })

})

