const vue = Vue.createApp({
     data() {
         return {
             movieInModal: {title: null},
             movies: [],
             actors: []
         }
     },
     async created() {
         this.movies = await (await fetch('http://localhost:8080/movies')).json();
     },
     methods: {
         getMovie: async function(id) {
             this.movieInModal = await(await fetch(`http://localhost:8080/movies/${id}`)).json()
             let movieInfoModal = new bootstrap.Modal(document.getElementById('movieInfoModal'), {})
             movieInfoModal.show()
         }
     }
 }).mount('#app')
