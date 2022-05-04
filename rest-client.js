const vue = Vue.createApp({
  props: ['movie'],
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
    openEditModal() {
      this.actionButton = 'Save';
      this.dynamicTitle = 'Edit Movie';
      this.myModel = true;
    },
    handleSubmit() {
      this.submitting = true;

      axios
        .post('http://localhost:8080/movies', {
          title: this.title,
          year: this.year,
          actors: this.actors,
        })
        .then((response) => {
          const { data } = response;
          this.movies.push(data);
          this.title = '';
          this.year = '';
          this.actors = [];
          this.submitting = false;
          this.myModel = false;
        });
    },
    async updateMovie(id) {
      this.openEditModal();
      

    },
    deleteData(index) {
      this.movies.splice(index, 1);
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
