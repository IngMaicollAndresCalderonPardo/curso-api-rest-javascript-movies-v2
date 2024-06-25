//Data

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers:{
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'api_key': API_KEY,
        'language':navigator.language || "es-ES"
    }
});

function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;  
    
    if(item){
        movies = item;
    }else{
        movies = {};
    }

    return movies;
}

function likeMovie(movie){

    const likedMovies = likedMoviesList();
    console.log(likedMovies);

    if(likedMovies[movie.id]){
        // console.log('Pelicula en LS, eliminar')
        likedMovies[movie.id] = undefined;
    }
    else{
        // console.log('Pelicula no esta en LS, agregar')
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
}

//Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // console.log({entry});
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);
        }
    });
});

function createMovies(
    movies, 
    container, 
    {
        lazyLoad = false,
        clean = true
    }
){
    if(clean){
        container.innerHTML = "";
    }

    movies.forEach(movie => {        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );
        movieImg.addEventListener('click',() => {
            location.hash = '#movie=' + movie.id;
        });
        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute('src','https://static.platzi.com/static/images/error/img404.png');
        });
        
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click',() =>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie)
            getLikedMovies();
            getTrendingMoviesPreview();
        });

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg); 
        movieContainer.appendChild(movieBtn); 
        container.appendChild(movieContainer);
    });

}

function createCategories(categories, container){

    container.innerHTML = "";
    categories.forEach(category => {
           
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', "id"+category.id);
        categoryTitle.addEventListener('click',() =>{
            location.hash = `#category=${category.id}-${category.name}`;
        });

        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    });
}

//Llamados a la API
async function getTrendingMoviesPreview(){

    const { data } = await api('trending/movie/day');
    const movies = data.results;
    console.log(movies);

    createMovies(movies,trendingMoviesPreviewList,{lazyLoad:true,clean:true});
}

async function getCategoriesMoviesPreview(){
    
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    console.log(categories);
    createCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory(id){

    const { data } = await api('discover/movie',{
        params:{
            with_genres:id,
        }
    });

    const movies = data.results;
    console.log(movies);
    createMovies(movies,genericSection,{lazyLoad:true});
}

function getPaginatedMoviesByCategory(id){
    
    return async function () {

        const {
            scrollTop,
            clientHeight,
            scrollHeight
        } = document.documentElement;
        
    
        const scrollIsBtn = (scrollTop + clientHeight)  >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBtn && pageIsNotMax){
            page++;
    
            const { data } = await api('discover/movie',{
                params:{
                    with_genres:id,
                    page
                }
            });
    
            const movies = data.results;
        
            createMovies(
                movies,
                genericSection,
                {
                    lazyLoad:true,
                    clean:false
                }
            );
        }
    }
}

async function getMoviesBySearch(query){

    const { data } = await api('search/movie',{
        params:{
            query
        }
    });

    const movies = data.results;
    console.log(movies);
    maxPage = data.total_pages;
    createMovies(
        movies,
        genericSection,
        {
            lazyLoad:true,
        }
    );
}

function getPaginatedMoviesBySearch(query){
    
    return async function () {

        const {
            scrollTop,
            clientHeight,
            scrollHeight
        } = document.documentElement;
    
        const scrollIsBtn = (scrollTop + clientHeight)  >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBtn && pageIsNotMax){
            page++;
    
            const { data } = await api('search/movie',{
                params:{
                    query,
                    page
                }
            });
    
            const movies = data.results;
        
            createMovies(
                movies,
                genericSection,
                {
                    lazyLoad:true,
                    clean:false
                }
            );
        }
    }
}

//CODIGO FUNCIONAL CONTIENE PAGINADO
// async function getTrendingMovies(page = 1){
    
//     const { data } = await api('/trending/movie/day', {
//         params: {
//             page,
//         }
//     });

//     const movies = data.results;
//     createMovies(
//         movies, 
//         genericSection, {
//         lazyLoad: true,
//         clean: page == 1
//     });
    
//     const btnLoadMore = document.createElement('button');
//     btnLoadMore.innerText = "Cargar más";
//     btnLoadMore.addEventListener('click', () => {
//         btnLoadMore.style.display = 'none';
//         getTrendingMovies(page + 1);
//     });
//     genericSection.appendChild(btnLoadMore); 
// }

//CODIGO FUNCIONAL CONTIENE UNA FUNCION APARTE CON CONTADOR 

async function getTrendingMovies(){

    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    // console.log(movies);
    
    createMovies(
        movies,
        genericSection,
        {
            lazyLoad:true,
            clean:true
        }
    );
}

async function getPaginatedTrendingMovies(){
    
    const {
        scrollTop,
        clientHeight,
        scrollHeight
    } = document.documentElement;

    const scrollIsBtn = (scrollTop + clientHeight)  >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBtn && pageIsNotMax){
        page++;
        
        const { data } = await api('trending/movie/day',{
            params:{
               page
            }
        });

        const movies = data.results;
    
        createMovies(
            movies,
            genericSection,
            {
                lazyLoad:true,
                clean:false
            }
        );
    }
}

async function getMovieById(movieId){

    const { data:movie } = await api('movie/'+ movieId);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    
    createCategories(movie.genres,movieDetailCategoriesList);
    getRelatedMovieById(movieId);
}

async function getRelatedMovieById(movieId){
    const { data } = await api(`movie/${movieId}/recommendations`);
    const relatedMovies = data.results;
    createMovies(relatedMovies,relatedMoviesContainer,{lazyLoad:true,clean:true})
}

function getLikedMovies(){

    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)
    createMovies(moviesArray,likedMoviesListArticle,{lazyLoad:true,clean:true})

}