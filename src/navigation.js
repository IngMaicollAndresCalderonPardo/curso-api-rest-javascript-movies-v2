let maxPage;
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click',()=>{
    location.hash = '#search='+ searchFormInput.value;
});

trendingBtn.addEventListener('click',()=>{
    location.hash = '#trends=';
});

// arrowBtn.addEventListener('click',()=>{
//     history.back();
// });

arrowBtn.addEventListener('click', () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = '';
    } else {
        window.history.back();
    }
});

// window.addEventListener('DOMContentLoaded',navigator,false);
window.addEventListener(
    'DOMContentLoaded',
    () => {
        navigator();
        // Agregando un estado de carga inical
        window.history.pushState({ loadUrl: window.location.href }, null, '');
    },
    false,
);
window.addEventListener('hashchange',navigator,false);
window.addEventListener('scroll',infiniteScroll,false)

function navigator(){
    console.log({location});

    if(infiniteScroll){
        window.removeEventListener('scroll',infiniteScroll,{passive:false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }
    else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }
    else{
        homePage();
    }

    // document.body.scrollTop = 0
    // document.documentElement.scrollTop = 0
    window.scrollTo(0,0);

    if(infiniteScroll){
        window.addEventListener('scroll',infiniteScroll,{passive:false});
    }

}

function homePage(){
    console.log('Home!!'); 

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.remove('inactive');  
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesMoviesPreview();
    getLikedMovies();
}

function categoriesPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.add('inactive');  
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#category','id-name']
    const [,categoryData] = location.hash.split('=');
    const [categoryId,categoryName] = categoryData.split('-');
    headerCategoryTitle.innerHTML = categoryName;
    getMoviesByCategory(categoryId);
    
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);

}

function movieDetailsPage(){
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');

    headerTitle.classList.add('inactive');  
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    //['#Movie', '5545']
    const [,movieId] = location.hash.split('=');
    getMovieById(movieId);

}

function searchPage(){
    console.log('search!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.add('inactive');  
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    //['#search','platzi']
    const [,query] = location.hash.split('=');
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage(){
    console.log('trends!!'); 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.add('inactive');  
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies()

    infiniteScroll = getPaginatedTrendingMovies;
}




