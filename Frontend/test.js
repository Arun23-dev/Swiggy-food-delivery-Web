const filteredData = [
    {
        card: {
            card: {
                itemCards: [{ id: 3 }, { id: 4 }]
            }
        }
    },

    {
        card: {
            card: {
                categories: {
                          [
                            {
                                item:itemCards: [{ id: 3 }, { id: 4 }]

                            },
                            {
                                 item:itemCards: [{ id: 3 }, { id: 4 }]

                            }

                          ]
                            
                        }
                    }
                },
            }
        }

    }

]

const newArray = filteredData.flatMap(item => {
    const inner = item.card.card;

    return inner.itemCards || inner.categories.card.card.itemCards || [];
});

console.log(newArray);

const menuData = [
    { card: { info: { name: "Whollfer stay lets bugs" } } },
    { card: { info: { name: "Ary special burger" } } },
    { card: { info: { name: "Wolfhere veg burger" } } },
    { card: { info: { name: "Ar classic wrap" } } },
    { card: { info: { name: "Stay fresh salad" } } },
    { card: { info: { name: "Paneer tikka pizza" } } },
]

function prefixMatch(word, query) {
    const shorter = query.length < word.length ? query : word
    const longer = query.length < word.length ? word : query
    return longer.startsWith(shorter)
}

function search(query) {
    return menuData.filter(item => {
        const name = item.card?.info?.name ?? ''
        const words = name.toLowerCase().split(' ')
        return words.some(w => prefixMatch(w, query.toLowerCase()))
    })
}

const queries = ['st', 'ay', 'ar', 'ary', 'wh', 'veg', 'ug']

queries.forEach(q => {
    const results = search(q).map(i => i.card.info.name)
    console.log(`"${q}" =>`, results.length ? results : 'no results')
})

const obj={
    id:1,
    name:"Arun",
    lastName:'chaudhary'
};
const new obj=


  const itemTotal = cart?.reduce((sum, item) => sum + (Math.floor(item.defaultPrice || item.price || 0) / 100)) * item.quantity, 0);
  const total = Math.round(itemTotal + DELIVERY_FEE);