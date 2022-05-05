const vue = Vue.createApp({
  data() {
    return {
      movieInModal: { title: null },
      movies: {},
      actors: [{ name: '' }],
      // actor: {},
      myModel: false,
      dynamicTitle: 'Add Movie',
      actionButton: 'Insert',
      loading: false,
      submitting: false,
      title: '',
      year: '',
      test_movie: {},
      test_id: '',
      movie: {},
    };
  },
  async created() {
    this.movies = await (await fetch('http://localhost:8080/movies')).json();
  },
  methods: {
    async getMovie(id) {
      this.movieInModal = await (await fetch(`http://localhost:8080/movies/${id}`)).json();
      const movieInfoModal = new bootstrap.Modal(document.getElementById('movieInfoModal'), {});
      movieInfoModal.show();
    },
    addActor() {
      this.actors.push({ name: '' });
    },
    async fetchAllData() {
      this.loading = true;
      this.movies = [];

      axios.get('http://localhost:8080/movies')
        .then((response) => {
          const { data } = response;
          this.movies = response.data;
          this.loading = false;
        });
    },
    openModal() {
      this.title = '';
      this.year = '';
      this.actors = [],
      this.actionButton = 'Insert';
      this.dynamicTitle = 'Add Movie';
      this.myModel = true;
    },
    openEditModal(movie) {
      this.actionButton = 'Save';
      this.dynamicTitle = 'Edit Movie';
      this.myModel = true;
      //this.title = movie.title;
      // kopeeri moviewt kõik This-i sisse
      for (let key in movie) {
        this[key] = movie[key]
      }
    },
    handleSubmit() {
      this.submitting = true;

      const clearModal = () => {
        this.id = undefined;
        this.title = '';
        this.year = '';
        this.actors = [];
        this.submitting = false;
        this.myModel = false;
      }

      // console.log("submit", this, this.title, this.id);
      let data = {
        title: this.title,
        year: this.year,
        actors: this.actors,
        // actors: [{ name: this.name }],

      }
      let isNew = this.id === undefined
      if(isNew) {
        axios
        .post('http://localhost:8080/movies', data)
        .then((response) => {
          const { data } = response;
          this.movies.push(data);
          clearModal()
        });
      } else {
        axios
        .put('http://localhost:8080/movies/'+this.id, data)
        .then((response) => {
          const { data } = response;

          // Update existing movie
          let currentMovie = this.movies.find(movie => movie.id == this.id);
          if (currentMovie) {
            for (let key in data.movie) {
              currentMovie[key] = data.movie[key]
            }
          }
          clearModal()
        });
      }
    },
    async updateMovie(movie) {
      //fetch("movies/"+movie.id, {body: movie})
      


    },
    deleteData(movie, index) {
      if(confirm("Are you sure you want to remove this movie?")) {
        console.log(index)
        this.movies.splice(index, 1);

        // fetch("movies/"+movie.id)
      }    
    },

    loadData() {
      axios.get('http://localhost:8080/movies/').then((result)=>{
      this.movies = result.data
    })
      

    }
  },
  mounted() 
  {
    this.loadData();
  }
}).mount('#app');
