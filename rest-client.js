const vue = Vue.createApp({
     data() {
         return {
             movieInModal: {title: null},
             movies: [],
             actors: [],
             myModel:false,
             dynamicTitle:'Add Movie',
             actionButton:'Insert',

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
         },
         openModel: function(){
            title = '';
            year = '';
            actors = [];
            actionButton = "Insert";
            dynamicTitle = "Add Movie";
            this.myModel = true;
           },
           submitData:function(){
            if(title != '' && year != '')
            {
             if(actionButton == 'Insert')
             {
              app.post('/movies', (req, res), {
               action:'insert',
               title:app.title, 
               year:app.year,
               actors: app.actors
              }).then(function(response){
               app.myModel = false;
               app.fetchAllData();
               app.title = '';
               app.year = '';
               alert(response.data.message);
              });
             }
            }
        }
     }
 }).mount('#app')
