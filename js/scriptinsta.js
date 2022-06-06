

require ('dotenv').config();

const auth_token = process.env.AUTH_TOKEN;

console.log(auth_token);

const carrouselSlider = {
    el: {
        instaContainer: $('#insta')
    },


    handleBuildCarrousel(data) {
        // destructure data object
        const {
            caption,
            id,
            media_type,
            media_url,
            permalink,
        } = data

        // build html string
        const carrouselSliderContainer = `
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" data-interval="1000">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    </ol>
                    <div class="carousel-inner">                    
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            `;

        this.el.instaContainer.append(carrouselSliderContainer);

        // loop through data and append to carrousel
        data.map((feedItem, index) => {
            const videoContent = `<div class="carousel-item ${index === 0 ? 'active':''}"><div class="col-6 col-md-4" controls><source src="${feedItem.media_url}" type="video/mp4></video></div></div>`;
            const imageContent = `<div class="carousel-item ${index === 0 ? 'active':''}"><div class="col-6 col-md-4"><img src="${feedItem.media_url}" alt="${feedItem.caption}" class="img-fluid"></div></div>`;
            const contentInsideCarouselItem = media_type === 'video' ? videoContent : imageContent;

            $('.carousel-inner').append(contentInsideCarouselItem)
        })
    },

    event() {
        const token =  AUTH_TOKEN;
        const url = `https://graph.instagram.com/me/media?access_token=${token}&fields=media_url,media_type,caption,permalink`

        const carrouselEmpty = `<div class="col-6 col-md-4 mb-3">Galeria do Instagram vazia</div>`

        $.get(url).then((response) => {
            // check if response is empt
            if (!response.data) {
                return this.el.instaContainer.append(carrouselEmpty);
            }

            // call function to build carrousel
            this.handleBuildCarrousel(response.data);
        })
    },

    init() {
        this.event();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carrouselSlider.init()
})