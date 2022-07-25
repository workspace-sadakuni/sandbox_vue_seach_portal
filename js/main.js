const buttonCounter = {
  template: '<div><span>count: </span>{{ count }} <button v-on:click="countUp">Count</button></div>',
  data: () => ({
    count: 0
  }),
  methods: {
    countUp: function(event) {
      this.count++
    }
  }
}

const searchQiita = {
  template: '<p><input type="text" v-model="keyword"></p><p>{{ message }}</p><ul><li v-for="item in items"><a v-bind:href="item.url" target="_blank">{{ item.title }}</a> likes: {{ item.likes_count }} updated at: {{ item.updated_at.substring(0, item.updated_at.indexOf("T")) }}</li></ul>',
  data: () => ({
    items: null,
    keyword: '',
    message: ''
  }),
  watch: {
    keyword: function (newKeyword, oldKeyword) {
      this.message = 'Waiting for you stop typing...'
      this.debounceGetAnswer()
    }
  },
  mounted: function() {
    // this.getAnswer()
    this.debounceGetAnswer = _.debounce(this.getAnswer, 1000) // lodashのdebounceメソッドを利用し、指定時間内に同メソッドが実行されることを防ぐ。（キーワード入力の度にapiを叩くのを防ぐ。）
  },
  methods: {
    getAnswer: function() {
      if (this.keyword === '') {
        console.log('空文字')
        this.items = null
        return
      }

      this.message = 'Loading...'
      const vm = this
      const params = { page: 1, per_page: 20, query: this.keyword }
      axios.get('https://qiita.com/api/v2/items', { params })
           .then(function(response) {
            vm.items = response.data
            // console.log(response.data)
           })
           .catch(function(error) {
            vm.message = 'Error' + error
           })
           .finally(function() {
            vm.message = ''
           })
    }
  }
}


const app = Vue.createApp({
  data: () => ({
    isLarge: true,
    textFontWeight: true,
    hotels: null,
    hotelsKeyword: '',
    searchHotelMessage: ''
  }),
  components: {
    'button-counter': buttonCounter,
    'search-qiita' : searchQiita,
  },
  watch: {
    hotelsKeyword: function(newKeyword, oldKeyword) {
      this.message = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  mounted: function() {
    // this.getHotels()
    this.debouncedGetAnswer = _.debounce(this.getHotels, 1000)  // lodashのdebounceメソッドを利用し、指定時間内に同メソッドが実行されることを防ぐ。（キーワード入力の度にapiを叩くのを防ぐ。）
  },
  methods: {
    getHotels: function() {
      if(this.hotelsKeyword === '') {
        console.log('空文字')
        this.hotels = null
        return
      }
      this.searchHotelMessage = 'Loading...'
      const vm = this
      const APP_ID = RAKUTENID
      const params = { applicationId: APP_ID, keyword: this.hotelsKeyword }
      axios.get('https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20170426', { params })
           .then(function(response) {
            vm.hotels = response.data['hotels']
            console.log(response.data)['hotels']
           })
           .catch(function(error) {
            vm.searchHotelMessage = 'Error' + error
           })
           .finally(function() {
            vm.searchHotelMessage = ''
           })
    }
  }
})

app.mount('#app')