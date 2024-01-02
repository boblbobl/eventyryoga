require('dotenv').config()
const {documentToHtmlString} = require('@contentful/rich-text-html-renderer');

function renderImage(photo) {
    return `<div class="card-image">
        <figure class="image is-16by9">
            <img srcset="https:${photo.fields.file.url}?w=480&fm=webp&q=80&fit=fill&f=faces 480w,
                https:${photo.fields.file.url}?w=800&fm=webp&q=80&fit=fill&f=faces 800w" sizes="(max-width: 600px) 480px,800px"
                src="https:${photo.fields.file.url}?w=480&fit=fill&f=faces"
                alt="${ photo.fields.title }" loading="lazy">
        </figure>
    </div>`;
}

function renderLogo(imageRef) {
    return `<figure class="image is-64x64">
    <img src="https:${imageRef.fields.file.url}" alt="${ imageRef.fields.title }">
    </figure>`;
}

function renderRoundImage(imageRef) {
    return `<figure class="image is-square">
        <img class="is-rounded" src="https:${imageRef.fields.file.url}" alt="${ imageRef.fields.title }">
    </figure>`;
}

function renderButton(linkRef) {
    return `<a class="button ${ linkRef.fields.cssClass }" href="${ linkRef.fields.url }" alt="${ linkRef.fields.title }">${ linkRef.fields.buttonText }</a>`;
}

function renderCards(cards, renderAs) {
    output = ``;
    if (cards && renderAs) {   
        cards.forEach(cardRef => {
            switch(renderAs) {
                case 'halfs':
                    output += half(cardRef);
                    break;
                case 'thirds':
                    output += third(cardRef);
                    break;
                default:
                    output += card(cardRef);
            }
        });
    }

    return output;
}

function half(cardRef) {
    return `<div class="column is-half">
        <div class="card card-medium ${cardRef.fields.cssClass}">
        ${ renderImage(cardRef.fields.image) }
        <div class="card-content">
            <div class="content">
                <h3 class="title is-4 mb-2">${ cardRef.fields.title }</h3>
                ${ documentToHtmlString(cardRef.fields.text) }
            </div>
        </div>
        <footer class="card-footer">
            ${ cardRef.fields.link ? renderButton(cardRef.fields.link) : `` }
        </footer>
        </div>
    </div>`;
}

function third(cardRef) {
    return `<div class="column is-one-third">
        <div class="card card-medium ${cardRef.fields.cssClass}">
            <div class="card-content">
                <div class="content">
                    <h3 class="title is-4 mb-2">${ cardRef.fields.title }</h3>
                    <div class="is-size-5">
                    ${ documentToHtmlString(cardRef.fields.text) }
                    ${ cardRef.fields.image ? renderLogo(cardRef.fields.image) : `` }
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function twoColums(cardRef) {
    column1 = {
        content: cardRef.fields.text.content.slice(0, cardRef.fields.text.content.length / 2),
        nodeType: "document"
    }
    column2 = {
        content: cardRef.fields.text.content.slice(cardRef.fields.text.content.length / 2, cardRef.fields.text.content.length),
        nodeType: "document"
    }

    return `<section class="section">
        <h2 class="subtitle is-3 has-text-centered">${cardRef.fields.title}</h2>
        <div class="container columns">
            <div class="column is-size-5">
                ${ documentToHtmlString( column1 ) }
            </div>
            <div class="column is-size-5">
                ${ documentToHtmlString( column2 ) }
            </div>
        </div>
    </section>`;
}

function sidekick(cardRef) {
    return `<section class="section">
        <div class="container columns">
            <div class="column is-two-thirds">
                <h2 class="subtitle is-3">${ cardRef.fields.title }</h2>
                <div class="is-size-5">
                    ${ documentToHtmlString(cardRef.fields.text) }
                    ${ cardRef.fields.link ? renderButton(cardRef.fields.link) : `` }
                </div>
            </div>
            <div class="column">
                ${ cardRef.fields.image ? renderRoundImage(cardRef.fields.image) : `` }
            </div>
        </div>
    </section>`;
}

function card(cardRef) {
    return `<section class="hero is-medium ${cardRef.fields.cssClass}">
    <div class="hero-body container">
      <h2 class="title is-4">${ cardRef.fields.title }</h2>
      <div class="is-size-5">
        ${ documentToHtmlString(cardRef.fields.text) }
      </div>
    </div>

  </section>`;
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addShortcode("documentToHtmlString", documentToHtmlString)
    eleventyConfig.addShortcode("card", function(cardRef) {
        if (cardRef.fields.renderAs) {
            if (cardRef.fields.renderAs == 'two-columns') {
                return twoColums(cardRef);
            }
            else if (cardRef.fields.renderAs == 'sidekick') {
                return sidekick(cardRef);
            }
        }
        return card(cardRef);
    });
    eleventyConfig.addShortcode("cardList", function(cardListRef) {
        return `
          <section class="section">
            <h2 class="subtitle is-3 has-text-centered">${cardListRef.fields.title}</h2>
            <div class="is-size-5 has-text-centered">${ documentToHtmlString( cardListRef.fields.text ) }</div>
            <div class="container columns is-multiline">
                ${renderCards(cardListRef.fields.cards, cardListRef.fields.renderAs)}
            </div>
          </section>`;
    });
    eleventyConfig.addPassthroughCopy("src/css")
    eleventyConfig.addPassthroughCopy("src/images")
    eleventyConfig.addPassthroughCopy("src/js")
    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};
