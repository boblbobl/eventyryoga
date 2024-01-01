require('dotenv').config()
const {documentToHtmlString} = require('@contentful/rich-text-html-renderer');

function renderCourses(children) {
    output = ``;
    children.forEach(courseRef => {
        output += `<div class="column is-half">
        <div class="card card-medium is-info">
        <div class="card-image">
            <figure class="image is-16by9">
            <img src="images/yoga-1.jpg" alt="Yoga Nidra">
            </figure>
        </div>
        <div class="card-content">
            <div class="content">
                <h3 class="title is-4 mb-2">` + courseRef.fields.title + `</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
            </div>
        </div>
        <footer class="card-footer">
            <a class="button is-light" href="https://www.fof.dk/da/aarhus/kurser/motion-og-sundhed/body-mind/yoga/hatha-yoga/rolig-yin-yoga-og-yoga-nidra">Tilmeld</a>
        </footer>
        </div>
    </div>`;
    });

    return output;
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addShortcode("documentToHtmlString", documentToHtmlString)
    
    eleventyConfig.addShortcode("card", function(cardRef) {
        return `
          <section class="section">
            <h2 class="subtitle is-3 has-text-centered">${cardRef.fields.title}</h2>
            ${ documentToHtmlString( cardRef.fields.text ) }
            <div class="container columns is-multiline">
            ${ renderCourses(cardRef.fields.references) }
            </div>
          </section>`;
      });
    eleventyConfig.addShortcode("course", function(courseRef) {
        return `<div class="column is-half">
            <div class="card card-medium is-info">
            <div class="card-image">
                <figure class="image is-16by9">
                <img src="images/yoga-1.jpg" alt="Yoga Nidra">
                </figure>
            </div>
            <div class="card-content">
                <div class="content">
                    <h3 class="title is-4 mb-2">${courseRef.fields.title}</h3>
                    ${ documentToHtmlString(courseRef.fields.description) }
                </div>
            </div>
            <footer class="card-footer">
                <a class="button is-light" href="https://www.fof.dk/da/aarhus/kurser/motion-og-sundhed/body-mind/yoga/hatha-yoga/rolig-yin-yoga-og-yoga-nidra">Tilmeld</a>
            </footer>
            </div>
        </div>`;
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
