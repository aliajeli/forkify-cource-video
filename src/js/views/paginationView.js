import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //  console.log(numPages);
    // Page 1 , and there are other pages

    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }
    // Other page
    if (curPage < numPages) {
      return `${this._generateMarkupButton('prev')}${this._generateMarkupButton(
        'next'
      )}`;
    }
    // Page 1 , and there are no other pages
    return ``;
  }
  _generateMarkupButton(page) {
    if (page === 'prev') {
      return `
         <button data-goto="${
           this._data.page - 1
         }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
               <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
         </button>
        `;
    }
    if (page === 'next') {
      return `
         <button data-goto="${
           this._data.page + 1
         }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }
  }
}

export default new PaginationView();
