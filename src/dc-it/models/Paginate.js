export default class Paginate {
    models = [];

    currentPage;

    lastPage;

    perPage;

    total;

    related;

    model;

    constructor(models, currentPage, lastPage, perPage, total, related, model) {
      this.models = models
      this.currentPage = currentPage
      this.lastPage = lastPage
      this.perPage = perPage
      this.total = total
      this.related = related
      this.model = model
    }

    static async initPagination(className, related = [], page = 1) {
      return className.with(related).paginate(page)
    }

    async reloadPage() {
      return this.model.with(this.related).paginate(this.currentPage)
    }

    isLastPage() {
      return this.currentPage === this.lastPage
    }

    isFirstPage() {
      return this.currentPage === 1
    }

    async nextPage() {
      this.currentPage += 1
      return this.model.with(this.related).paginate(this.currentPage)
    }

    async prevPage() {
      this.currentPage -= 1
      return this.model.with(this.related).paginate(this.currentPage)
    }

    async gotoPage(page) {
      this.currentPage = page
      return this.model.with(this.related).paginate(this.currentPage)
    }
}
