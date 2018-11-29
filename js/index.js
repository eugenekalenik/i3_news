(function () {

  const BASE_URL = 'https://newsapi.org/v2/everything?q=';
  const API_KEY = '700e4adb5d1248b191265b4ceb3fc20e';
  const tabs = [
    { id: 1, title: 'people' },
    { id: 2, title: 'auto' },
    { id: 3, title: 'techno' },
    { id: 4, title: 'realty' },
  ];

  class News {
    constructor(rootElementId) {
      this.rootElement = document.getElementById(rootElementId);
      this.state = { data: null, activeTab: tabs[0].title };
      this.init();
    }

    init() {
      this.eventsListener();
      this.getNews(tabs[0].title);
      this.render();
    }

    eventsListener() {
      document.addEventListener('click', (e) => {
        this.switchPage(e.target);
      });
    }

    switchPage(touchedTab) {
      tabs.forEach(tab => {
        if (touchedTab.classList.contains(tab.title)) {
          this.setState({ activeTab: tab.title });
          this.getNews(tab.title);
          this.scrollTop();
        }
      });
    }

    setState(nextState) {
      this.state = { ...this.state, ...nextState };
      this.render();
    }

    async getNews(topic) {
      let data;

      try {
        data = await fetch(BASE_URL + topic + '&apiKey=' + API_KEY)
          .then(response => response.json());

        this.setState({ data });
      } catch (error) {
        alert(error);
      }
    }

    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderNews() {
      const { data } = this.state;
      let newsList = document.querySelector('.news-list');

      if (!data) {
        return newsList.innerHTML = '<div class="loader">Loading...</div>';
      }

      if (data.articles.length === 0) {
        return newsList.innerHTML = '<div class="loader">No news...</div>';
      }

      if (data.articles.length !== 0) {
        data.articles.map((item, index) => {
          newsList.innerHTML +=
            `<div key=${index} class="news-item" style="
              background-image: url(${item.urlToImage});
              background-size: cover;
            ">
              <div class="filter">
                <div class="date">${new Date(item.publishedAt).toDateString()}</div>
                <div class="title">${item.title}</div>
                <div class="author"><span>Author:</span> ${item.author}</div>
                <a class="source" href=${item.url}>${item.source.name}</a>
              </div>
            </div>`
        })
      }
    }

    render() {
      this.rootElement.innerHTML = `
        <div class="tabs">
          <div class="tab people ${this.state.activeTab === 'people' ? 'active' : ''}">PEOPLE</div>
          <div class="tab auto ${this.state.activeTab === 'auto' ? 'active' : ''}">AUTO</div>
          <div class="tab techno ${this.state.activeTab === 'techno' ? 'active' : ''}">TECHNO</div>
          <div class="tab realty ${this.state.activeTab === 'realty' ? 'active' : ''}">REALTY</div>
        </div>
        <div class="news-list"></div>
      `;
      this.renderNews();
    }
  }

  new News('root');
}());