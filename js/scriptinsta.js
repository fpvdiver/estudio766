<<<<<<< HEAD


require ('dotenv').config();

const auth_token = process.env.AUTH_TOKEN;

console.log(auth_token);

=======
>>>>>>> 5ab4f4e150e2bed6e2b8e6fba28122a03d77db04
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
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" data-interval="3000">
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
            const imageContent = `<div class="carousel-item ${index === 0 ? 'active':''}"><a href="${feedItem.permalink}" target="_blank" rel="noopener"><img class="img-fluid d-block" src="${feedItem.media_url}" alt="${feedItem.caption}"></a></div>`;
            $('.carousel-inner').append(imageContent)
        })
    },

    event() {
        const token = "#"
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
