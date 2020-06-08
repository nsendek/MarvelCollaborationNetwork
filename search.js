function setupSearch() {
  searchTool = new autoComplete({
  data: {
    src: () => Array.from(tree.heroSet),
    key: ["name", "id"],
    cache: false
  },
  sort: (a, b) => {
    if (a.name < b.name) {return -1;}
    if (a.name > b.name) {return 1;}
    return 0;
  },
  placeHolder: "Find Character",
  selector: "#autoComplete",
  threshold: 0,
  debounce: 0,
  searchEngine: "strict",
  maxResults: 7,
  resultsList: {
        render: true,
        container: source => {
            source.setAttribute("id", "hero_list");
        },
        destination: document.querySelector("#inputContainer"),
        position: "afterend",
        element: "ul"
    },
    onSelection: feedback => {
        let hero = feedback.selection.value;
        if (state.displayMode == 'global') {
          state.hover(hero);
          d3.select(`#h${hero.id}`).transition().attr('fill',"#ff0000b4").attr('r', d => 2*d.getRadius());
        } else {
          state.select(hero);
          LocalNetwork();
        }

        d3.select("#autoComplete").node().value = "";
    }
});
  
// off click is used only to register that the search window should close. kind of a bug
  offclick();
}