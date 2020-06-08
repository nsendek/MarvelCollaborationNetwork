import json
if __name__ == "__main__":
    # with open("./comics.json") as f:
    #     comics = json.load(f)

    with open("./heroes.json") as f:
        heroes = json.load(f)

    # with open("./edges.json") as f:
    #     edges = json.load(f)

    # del heroes['count']
    # del edges['count']
    # del comics['count']
    # del comics['all']

    # json.dump(comics,open('comics.min.json', 'w'))
    json.dump(heroes,open('heroes.min.json', 'w'))
    # json.dump(edges,open('edges.min.json', 'w'))