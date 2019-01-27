import React, {Component} from 'react'

class Article extends Component {
    constructor(props) {
        super(props);
    }

    onReserve(id, nbPlaces, price) {
        console.log('reserve')
        this.props.onReserve(id, nbPlaces, price);
    }

    render() {
        const articles = this.props.articles;
        return (
            <article key='0'>
                {articles.forEach(function (article, index) {
                  article.reservedplaces < article.numberofplaces &&
                        <li key='0'>0, {article.date}, {article.end} , {article.departurecity},{article.arrivalcity}
                            , {article.numberofplaces} ,{article.reservedplaces} ,{article.price}
                            <button onClick={this.onReserve.bind(this, 0, 1, article.price)}>reserve</button>
                        </li>

                    article.reservedplaces <= article.numberofplaces &&
                        <li key='0'>0, {article.date}, {article.end} , {article.departurecity},{article.arrivalcity}
                            , {article.numberofplaces} ,{article.reservedplaces} ,{article.price}
                        </li>
                })}
            </article>
        );


    }
}

export default Article