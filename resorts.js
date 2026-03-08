const RESORTS = [{"id":"mohawk-mountain","name":"Mohawk Mountain","state":"CT","region":"Connecticut","passGroup":"Indy","ownerGroup":"Indy + independent","lat":41.83549,"lon":-73.31095,"vertical":650,"trails":31,"lifts":3,"acres":146,"longestRun":1.5,"snowmaking":10000,"price":72,"night":true,"terrainPark":false,"baseElevation":950,"summitElevation":1600,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.3,"intermediate":0.5,"advanced":0.2},"rating":3.2,"ratingCount":38},{"id":"mount-southington-ski-area","name":"Mount Southington","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.58206,"lon":-72.92492,"vertical":425,"trails":24,"lifts":5,"acres":53,"longestRun":0.3,"snowmaking":5100,"price":72,"night":true,"terrainPark":false,"baseElevation":100,"summitElevation":525,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.43,"intermediate":0.43,"advanced":0.14},"rating":3.1,"ratingCount":28},{"id":"powder-ridge-park","name":"Powder Ridge","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.50052,"lon":-72.74075,"vertical":550,"trails":28,"lifts":4,"acres":78,"longestRun":0.5,"snowmaking":6800,"price":76,"night":true,"terrainPark":false,"baseElevation":170,"summitElevation":720,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.42,"intermediate":0.37,"advanced":0.21},"rating":3.3,"ratingCount":1},{"id":"ski-sundown","name":"Ski Sundown","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.88469,"lon":-72.9467,"vertical":625,"trails":30,"lifts":2,"acres":115,"longestRun":1.0,"snowmaking":7000,"price":79,"night":true,"terrainPark":false,"baseElevation":450,"summitElevation":1075,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.5,"intermediate":0.25,"advanced":0.19},"rating":3.2,"ratingCount":31},{"id":"woodbury-ski-area","name":"Woodbury","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5906,"lon":-73.25536,"vertical":300,"trails":21,"lifts":5,"acres":35,"longestRun":0.2,"snowmaking":5000,"price":67,"night":false,"terrainPark":false,"baseElevation":430,"summitElevation":730,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.25,"intermediate":0.25,"advanced":0.25},"rating":2.2,"ratingCount":15},{"id":"berkshire-east","name":"Berkshire East","state":"MA","region":"Massachusetts","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.62266,"lon":-72.87838,"vertical":1180,"trails":46,"lifts":5,"acres":315,"longestRun":2.0,"snowmaking":15000,"price":80,"night":true,"terrainPark":false,"baseElevation":540,"summitElevation":1720,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.37,"intermediate":0.44,"advanced":0.17},"rating":3.1,"ratingCount":26},{"id":"blandford-ski-area","name":"Blandford","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.19436,"lon":-72.91167,"vertical":465,"trails":25,"lifts":5,"acres":66,"longestRun":0.5,"snowmaking":8200,"price":72,"night":false,"terrainPark":false,"baseElevation":1035,"summitElevation":1685,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.4,"intermediate":0.5,"advanced":0.1},"rating":2.7,"ratingCount":9},{"id":"blue-hills-ski-area","name":"Blue Hills","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.21536,"lon":-71.11928,"vertical":309,"trails":21,"lifts":4,"acres":31,"longestRun":0.0,"snowmaking":6000,"price":69,"night":true,"terrainPark":false,"baseElevation":326,"summitElevation":635,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.13,"intermediate":0.25,"advanced":0.62},"rating":3.1,"ratingCount":9},{"id":"bousquet-ski-area","name":"Bousquet","state":"MA","region":"Massachusetts","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.41801,"lon":-73.2772,"vertical":750,"trails":33,"lifts":5,"acres":138,"longestRun":1.0,"snowmaking":9800,"price":70,"night":true,"terrainPark":false,"baseElevation":1125,"summitElevation":1875,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.34,"intermediate":0.33,"advanced":0.33},"rating":3.2,"ratingCount":9},{"id":"bradford-ski-area","name":"Bradford","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.74473,"lon":-71.05582,"vertical":248,"trails":19,"lifts":8,"acres":31,"longestRun":0.3,"snowmaking":4800,"price":71,"night":true,"terrainPark":false,"baseElevation":1300,"summitElevation":1548,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.1,"intermediate":0.8,"advanced":0.1},"rating":3.1,"ratingCount":7},{"id":"jiminy-peak","name":"Jiminy Peak","state":"MA","region":"Massachusetts","passGroup":"Ikon","ownerGroup":"Ikon network","lat":42.54425,"lon":-73.28622,"vertical":1150,"trails":45,"lifts":5,"acres":307,"longestRun":2.0,"snowmaking":16300,"price":128,"night":true,"terrainPark":true,"baseElevation":1230,"summitElevation":2380,"avgSnowfall":109,"terrainBreakdown":{"beginner":0.53,"intermediate":0.27,"advanced":0.13},"rating":3.5,"ratingCount":67},{"id":"nashoba-valley","name":"Nashoba Valley","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.54256,"lon":-71.44504,"vertical":240,"trails":19,"lifts":8,"acres":34,"longestRun":0.5,"snowmaking":5200,"price":72,"night":true,"terrainPark":false,"baseElevation":200,"summitElevation":440,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.24,"intermediate":0.47,"advanced":0.29},"rating":3.1,"ratingCount":17},{"id":"otis-ridge-ski-area","name":"Otis Ridge","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.19638,"lon":-73.0984,"vertical":400,"trails":23,"lifts":4,"acres":73,"longestRun":1.0,"snowmaking":5500,"price":75,"night":false,"terrainPark":false,"baseElevation":1300,"summitElevation":1700,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":2.8,"ratingCount":5},{"id":"ski-butternut","name":"Ski Butternut","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.18366,"lon":-73.32015,"vertical":1000,"trails":41,"lifts":10,"acres":225,"longestRun":1.5,"snowmaking":11000,"price":86,"night":true,"terrainPark":false,"baseElevation":800,"summitElevation":1800,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.2},"rating":3.2,"ratingCount":50},{"id":"ski-ward","name":"Ski Ward","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.30165,"lon":-71.68197,"vertical":210,"trails":18,"lifts":3,"acres":25,"longestRun":0.2,"snowmaking":4500,"price":68,"night":true,"terrainPark":false,"baseElevation":210,"summitElevation":420,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.5,"advanced":0.2},"rating":2.6,"ratingCount":3},{"id":"wachusett-mountain-ski-area","name":"Wachusett","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.50298,"lon":-71.88631,"vertical":1000,"trails":41,"lifts":4,"acres":225,"longestRun":1.5,"snowmaking":10800,"price":86,"night":true,"terrainPark":true,"baseElevation":1006,"summitElevation":2006,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":66},{"id":"big-squaw-mountain-ski-resort","name":"Big Moose Mountain","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":45.50672,"lon":-69.70202,"vertical":660,"trails":31,"lifts":2,"acres":110,"longestRun":0.8,"snowmaking":50,"price":83,"night":false,"terrainPark":false,"baseElevation":1750,"summitElevation":3200,"avgSnowfall":230,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":3.2,"ratingCount":7},{"id":"black-mountain-of-maine","name":"Black Mountain of Maine","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.5342,"lon":-70.5368,"vertical":1380,"trails":50,"lifts":3,"acres":600,"longestRun":2.0,"snowmaking":75,"price":55,"night":true,"terrainPark":false,"baseElevation":1080,"summitElevation":2460,"avgSnowfall":110,"terrainBreakdown":{"beginner":0.24,"intermediate":0.38,"advanced":0.38},"rating":4.0,"ratingCount":120},{"id":"camden-snow-bowl","name":"Camden Snow Bowl","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.21727,"lon":-69.13467,"vertical":850,"trails":36,"lifts":2,"acres":156,"longestRun":1.0,"snowmaking":4800,"price":76,"night":false,"terrainPark":false,"baseElevation":150,"summitElevation":1080,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.09,"intermediate":0.3,"advanced":0.61},"rating":3.1,"ratingCount":4},{"id":"lost-valley","name":"Lost Valley","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.13406,"lon":-70.28237,"vertical":240,"trails":19,"lifts":2,"acres":30,"longestRun":0.3,"snowmaking":4500,"price":64,"night":true,"terrainPark":false,"baseElevation":255,"summitElevation":495,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.47,"intermediate":0.2,"advanced":0.33},"rating":2.7,"ratingCount":4},{"id":"mt-abram-ski-resort","name":"Mt. Abram","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.3798,"lon":-70.70686,"vertical":1150,"trails":45,"lifts":5,"acres":163,"longestRun":0.5,"snowmaking":17500,"price":76,"night":false,"terrainPark":false,"baseElevation":1050,"summitElevation":2250,"avgSnowfall":182,"terrainBreakdown":{"beginner":0.19,"intermediate":0.41,"advanced":0.26},"rating":3.2,"ratingCount":14},{"id":"mt-jefferson","name":"Mt. Jefferson","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":45.35399,"lon":-68.28303,"vertical":432,"trails":24,"lifts":3,"acres":54,"longestRun":0.3,"snowmaking":0,"price":73,"night":false,"terrainPark":true,"baseElevation":351,"summitElevation":753,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.0,"ratingCount":1},{"id":"new-hermon-mountain","name":"New Hermon","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.78079,"lon":-68.95727,"vertical":350,"trails":22,"lifts":3,"acres":90,"longestRun":1.9,"snowmaking":7000,"price":84,"night":false,"terrainPark":false,"baseElevation":100,"summitElevation":450,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.4,"intermediate":0.3,"advanced":0.3},"rating":2.6,"ratingCount":4},{"id":"saddleback-inc","name":"Saddleback","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.96506,"lon":-70.76822,"vertical":2000,"trails":69,"lifts":5,"acres":717,"longestRun":3.1,"snowmaking":12500,"price":100,"night":false,"terrainPark":false,"baseElevation":2460,"summitElevation":4120,"avgSnowfall":276,"terrainBreakdown":{"beginner":0.35,"intermediate":0.3,"advanced":0.25},"rating":3.1,"ratingCount":22},{"id":"shawnee-peak","name":"Shawnee Peak","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.05899,"lon":-70.81554,"vertical":1350,"trails":51,"lifts":3,"acres":225,"longestRun":0.8,"snowmaking":23400,"price":90,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":1900,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.25,"intermediate":0.45,"advanced":0.2},"rating":3.1,"ratingCount":20},{"id":"sugarloaf","name":"Sugarloaf","state":"ME","region":"Maine","passGroup":"Ikon","ownerGroup":"Ikon network","lat":45.03144,"lon":-70.31313,"vertical":2820,"trails":93,"lifts":10,"acres":1104,"longestRun":3.5,"snowmaking":61800,"price":157,"night":false,"terrainPark":false,"baseElevation":1417,"summitElevation":4237,"avgSnowfall":282,"terrainBreakdown":{"beginner":0.23,"intermediate":0.34,"advanced":0.28},"rating":3.2,"ratingCount":39},{"id":"sunday-river","name":"Sunday River","state":"ME","region":"Maine","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.46715,"lon":-70.84715,"vertical":2340,"trails":79,"lifts":7,"acres":819,"longestRun":3.0,"snowmaking":55200,"price":150,"night":false,"terrainPark":true,"baseElevation":825,"summitElevation":3150,"avgSnowfall":228,"terrainBreakdown":{"beginner":0.21,"intermediate":0.32,"advanced":0.23},"rating":3.3,"ratingCount":74},{"id":"attitash","name":"Attitash","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":44.08278,"lon":-71.2294,"vertical":1750,"trails":62,"lifts":5,"acres":612,"longestRun":3.0,"snowmaking":24000,"price":151,"night":false,"terrainPark":false,"baseElevation":600,"summitElevation":2350,"avgSnowfall":168,"terrainBreakdown":{"beginner":0.26,"intermediate":0.46,"advanced":0.28},"rating":3.2,"ratingCount":36},{"id":"black-mountain","name":"Black Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.16668,"lon":-71.16378,"vertical":1100,"trails":43,"lifts":4,"acres":257,"longestRun":1.6,"snowmaking":14000,"price":86,"night":false,"terrainPark":false,"baseElevation":1250,"summitElevation":2350,"avgSnowfall":168,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.08},"rating":3.1,"ratingCount":11},{"id":"bretton-woods","name":"Bretton Woods","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.25812,"lon":-71.44119,"vertical":1500,"trails":55,"lifts":5,"acres":400,"longestRun":2.0,"snowmaking":40000,"price":104,"night":false,"terrainPark":true,"baseElevation":1600,"summitElevation":3100,"avgSnowfall":205,"terrainBreakdown":{"beginner":0.25,"intermediate":0.29,"advanced":0.3},"rating":3.5,"ratingCount":64},{"id":"cannon-mountain","name":"Cannon Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.15645,"lon":-71.69842,"vertical":2180,"trails":74,"lifts":6,"acres":636,"longestRun":2.3,"snowmaking":19100,"price":102,"night":false,"terrainPark":false,"baseElevation":1900,"summitElevation":4080,"avgSnowfall":254,"terrainBreakdown":{"beginner":0.15,"intermediate":0.52,"advanced":0.33},"rating":3.3,"ratingCount":50},{"id":"cranmore-mountain-resort","name":"Cranmore","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.05685,"lon":-71.09959,"vertical":1200,"trails":46,"lifts":4,"acres":220,"longestRun":1.0,"snowmaking":19200,"price":94,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":2000,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.28,"intermediate":0.44,"advanced":0.28},"rating":3.2,"ratingCount":20},{"id":"crotched-mountain","name":"Crotched","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":42.99842,"lon":-71.87369,"vertical":1016,"trails":41,"lifts":3,"acres":203,"longestRun":1.2,"snowmaking":10000,"price":133,"night":true,"terrainPark":true,"baseElevation":1050,"summitElevation":2066,"avgSnowfall":153,"terrainBreakdown":{"beginner":0.28,"intermediate":0.4,"advanced":0.32},"rating":3.2,"ratingCount":32},{"id":"dartmouth-skiway","name":"Dartmouth Skiway","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.78775,"lon":-72.09954,"vertical":969,"trails":40,"lifts":4,"acres":186,"longestRun":1.1,"snowmaking":5400,"price":82,"night":false,"terrainPark":false,"baseElevation":974,"summitElevation":1943,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.21,"intermediate":0.5,"advanced":0.25},"rating":3.2,"ratingCount":5},{"id":"granite-gorge","name":"Granite Gorge","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.97098,"lon":-72.21204,"vertical":525,"trails":27,"lifts":4,"acres":74,"longestRun":0.5,"snowmaking":3900,"price":82,"night":false,"terrainPark":false,"baseElevation":800,"summitElevation":1325,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.35,"intermediate":0.35,"advanced":0.15},"rating":2.8,"ratingCount":4},{"id":"gunstock","name":"Gunstock","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.53538,"lon":-71.37009,"vertical":1400,"trails":52,"lifts":4,"acres":315,"longestRun":1.5,"snowmaking":17600,"price":99,"night":true,"terrainPark":false,"baseElevation":900,"summitElevation":2300,"avgSnowfall":165,"terrainBreakdown":{"beginner":0.12,"intermediate":0.61,"advanced":0.0},"rating":3.2,"ratingCount":27},{"id":"king-pine","name":"King Pine","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.86808,"lon":-71.0889,"vertical":350,"trails":22,"lifts":3,"acres":44,"longestRun":0.3,"snowmaking":4500,"price":70,"night":true,"terrainPark":false,"baseElevation":500,"summitElevation":850,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.44,"intermediate":0.31,"advanced":0.1},"rating":2.8,"ratingCount":8},{"id":"loon-mountain","name":"Loon Mountain","state":"NH","region":"New Hampshire","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.03597,"lon":-71.62144,"vertical":2100,"trails":72,"lifts":7,"acres":648,"longestRun":2.5,"snowmaking":32200,"price":150,"night":false,"terrainPark":true,"baseElevation":950,"summitElevation":3050,"avgSnowfall":202,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.17},"rating":3.7,"ratingCount":70},{"id":"mcintyre-ski-area","name":"McIntyre Ski Area","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.996,"lon":-71.488,"vertical":200,"trails":11,"lifts":5,"acres":20,"longestRun":0.5,"snowmaking":100,"price":45,"night":true,"terrainPark":true,"baseElevation":300,"summitElevation":500,"avgSnowfall":65,"terrainBreakdown":{"beginner":0.45,"intermediate":0.35,"advanced":0.2},"rating":3.4,"ratingCount":40},{"id":"mount-sunapee","name":"Mount Sunapee","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":43.33189,"lon":-72.08014,"vertical":1510,"trails":55,"lifts":6,"acres":252,"longestRun":0.8,"snowmaking":21500,"price":135,"night":false,"terrainPark":false,"baseElevation":1233,"summitElevation":2743,"avgSnowfall":187,"terrainBreakdown":{"beginner":0.26,"intermediate":0.49,"advanced":0.25},"rating":3.1,"ratingCount":54},{"id":"pats-peak","name":"Pats Peak","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.15944,"lon":-71.79604,"vertical":770,"trails":34,"lifts":8,"acres":173,"longestRun":1.5,"snowmaking":11500,"price":82,"night":true,"terrainPark":false,"baseElevation":690,"summitElevation":1460,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.5,"intermediate":0.21,"advanced":0.11},"rating":3.2,"ratingCount":38},{"id":"ragged-mountain-resort","name":"Ragged Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.50323,"lon":-71.8427,"vertical":1250,"trails":48,"lifts":4,"acres":198,"longestRun":0.7,"snowmaking":20000,"price":82,"night":false,"terrainPark":false,"baseElevation":1000,"summitElevation":2250,"avgSnowfall":162,"terrainBreakdown":{"beginner":0.23,"intermediate":0.3,"advanced":0.39},"rating":3.1,"ratingCount":38},{"id":"tenney-mountain","name":"Tenney Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.769,"lon":-71.812,"vertical":1500,"trails":53,"lifts":4,"acres":110,"longestRun":2.0,"snowmaking":65,"price":79,"night":false,"terrainPark":true,"baseElevation":749,"summitElevation":2250,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.22,"intermediate":0.42,"advanced":0.36},"rating":3.8,"ratingCount":65},{"id":"waterville-valley","name":"Waterville Valley","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.95007,"lon":-71.49952,"vertical":2020,"trails":70,"lifts":7,"acres":707,"longestRun":3.0,"snowmaking":22000,"price":105,"night":true,"terrainPark":true,"baseElevation":1984,"summitElevation":4004,"avgSnowfall":250,"terrainBreakdown":{"beginner":0.15,"intermediate":0.6,"advanced":0.22},"rating":3.4,"ratingCount":37},{"id":"whaleback-mountain","name":"Whaleback","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.6017,"lon":-72.18027,"vertical":700,"trails":32,"lifts":3,"acres":128,"longestRun":1.0,"snowmaking":6000,"price":79,"night":true,"terrainPark":false,"baseElevation":1100,"summitElevation":1800,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.23,"intermediate":0.41,"advanced":0.23},"rating":3.2,"ratingCount":7},{"id":"wildcat-mountain","name":"Wildcat","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":44.25895,"lon":-71.20146,"vertical":2112,"trails":72,"lifts":1,"acres":704,"longestRun":2.8,"snowmaking":20000,"price":154,"night":false,"terrainPark":false,"baseElevation":1950,"summitElevation":4062,"avgSnowfall":253,"terrainBreakdown":{"beginner":0.21,"intermediate":0.46,"advanced":0.33},"rating":3.2,"ratingCount":25},{"id":"campgaw-mountain","name":"Campgaw","state":"NJ","region":"New Jersey","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.05426,"lon":-74.19931,"vertical":274,"trails":20,"lifts":5,"acres":34,"longestRun":0.3,"snowmaking":2300,"price":71,"night":true,"terrainPark":false,"baseElevation":450,"summitElevation":726,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.33,"intermediate":0.33,"advanced":0.25},"rating":3.1,"ratingCount":21},{"id":"mountain-creek-resort","name":"Mountain Creek","state":"NJ","region":"New Jersey","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.19075,"lon":-74.50512,"vertical":1040,"trails":42,"lifts":4,"acres":277,"longestRun":2.0,"snowmaking":16700,"price":88,"night":true,"terrainPark":true,"baseElevation":440,"summitElevation":1480,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.17,"intermediate":0.63,"advanced":0.2},"rating":2.8,"ratingCount":128},{"id":"belleayre","name":"Belleayre","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.13224,"lon":-74.50531,"vertical":1404,"trails":52,"lifts":6,"acres":398,"longestRun":2.2,"snowmaking":16400,"price":103,"night":false,"terrainPark":false,"baseElevation":2025,"summitElevation":3429,"avgSnowfall":211,"terrainBreakdown":{"beginner":0.22,"intermediate":0.58,"advanced":0.1},"rating":3.3,"ratingCount":73},{"id":"brantling-ski-slopes","name":"Brantling","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.15012,"lon":-77.06574,"vertical":250,"trails":19,"lifts":5,"acres":27,"longestRun":0.1,"snowmaking":1600,"price":77,"night":true,"terrainPark":false,"baseElevation":600,"summitElevation":850,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":2.7,"ratingCount":14},{"id":"bristol-mountain","name":"Bristol Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.7467,"lon":-77.40194,"vertical":1200,"trails":46,"lifts":3,"acres":320,"longestRun":2.0,"snowmaking":14800,"price":100,"night":false,"terrainPark":true,"baseElevation":1000,"summitElevation":2200,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.35,"intermediate":0.45,"advanced":0.2},"rating":3.3,"ratingCount":54},{"id":"buffalo-ski-club-ski-area","name":"Buffalo Ski Club","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.68098,"lon":-78.69204,"vertical":500,"trails":26,"lifts":6,"acres":50,"longestRun":0.0,"snowmaking":15000,"price":81,"night":false,"terrainPark":false,"baseElevation":2025,"summitElevation":3429,"avgSnowfall":211,"terrainBreakdown":{"beginner":0.2,"intermediate":0.46,"advanced":0.0},"rating":3.2,"ratingCount":3},{"id":"catamount-ski-ride-area","name":"Catamount","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.45921,"lon":-73.87237,"vertical":1000,"trails":41,"lifts":6,"acres":267,"longestRun":2.0,"snowmaking":13000,"price":88,"night":true,"terrainPark":false,"baseElevation":1000,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.44,"advanced":0.14},"rating":3.2,"ratingCount":53},{"id":"dry-hill-ski-area","name":"Dry Hill","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.93123,"lon":-75.90181,"vertical":300,"trails":21,"lifts":3,"acres":35,"longestRun":0.2,"snowmaking":2600,"price":68,"night":true,"terrainPark":false,"baseElevation":650,"summitElevation":950,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.7,"ratingCount":10},{"id":"gore-mountain","name":"Gore Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.67328,"lon":-74.00684,"vertical":2537,"trails":84,"lifts":8,"acres":1205,"longestRun":4.5,"snowmaking":42500,"price":129,"night":false,"terrainPark":false,"baseElevation":998,"summitElevation":3600,"avgSnowfall":220,"terrainBreakdown":{"beginner":0.1,"intermediate":0.51,"advanced":0.34},"rating":3.3,"ratingCount":59},{"id":"greek-peak","name":"Greek Peak","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.51237,"lon":-76.14755,"vertical":952,"trails":39,"lifts":7,"acres":214,"longestRun":1.5,"snowmaking":18400,"price":84,"night":true,"terrainPark":false,"baseElevation":1148,"summitElevation":2100,"avgSnowfall":145,"terrainBreakdown":{"beginner":0.48,"intermediate":0.21,"advanced":0.24},"rating":3.1,"ratingCount":44},{"id":"hickory-ski-center","name":"Hickory","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.47441,"lon":-73.81735,"vertical":1200,"trails":46,"lifts":3,"acres":220,"longestRun":1.0,"snowmaking":0,"price":93,"night":false,"terrainPark":false,"baseElevation":700,"summitElevation":1900,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.3,"advanced":0.4},"rating":3.1,"ratingCount":6},{"id":"holimont-ski-area","name":"HoliMont","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.27316,"lon":-78.68944,"vertical":700,"trails":32,"lifts":5,"acres":158,"longestRun":1.5,"snowmaking":13500,"price":91,"night":false,"terrainPark":false,"baseElevation":1560,"summitElevation":2260,"avgSnowfall":153,"terrainBreakdown":{"beginner":0.26,"intermediate":0.28,"advanced":0.45},"rating":3.1,"ratingCount":10},{"id":"holiday-mountain","name":"Holiday Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.62959,"lon":-74.61449,"vertical":400,"trails":23,"lifts":4,"acres":53,"longestRun":0.4,"snowmaking":3700,"price":80,"night":false,"terrainPark":false,"baseElevation":1150,"summitElevation":1550,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.27,"advanced":0.31},"rating":2.7,"ratingCount":7},{"id":"holiday-valley","name":"Holiday Valley","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.25845,"lon":-78.67385,"vertical":750,"trails":33,"lifts":10,"acres":138,"longestRun":1.0,"snowmaking":26600,"price":90,"night":true,"terrainPark":true,"baseElevation":1500,"summitElevation":2250,"avgSnowfall":152,"terrainBreakdown":{"beginner":0.34,"intermediate":0.28,"advanced":0.37},"rating":3.3,"ratingCount":53},{"id":"hunt-hollow-ski-club","name":"Hunt Hollow","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.6461,"lon":-77.47812,"vertical":825,"trails":36,"lifts":3,"acres":151,"longestRun":1.0,"snowmaking":40000,"price":91,"night":false,"terrainPark":false,"baseElevation":1000,"summitElevation":2030,"avgSnowfall":142,"terrainBreakdown":{"beginner":0.32,"intermediate":0.21,"advanced":0.37},"rating":3.4,"ratingCount":1},{"id":"hunter-mountain","name":"Hunter Mountain","state":"NY","region":"New York","passGroup":"Epic","ownerGroup":"Epic network","lat":42.17787,"lon":-74.23042,"vertical":1600,"trails":58,"lifts":7,"acres":427,"longestRun":2.0,"snowmaking":24000,"price":143,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":3200,"avgSnowfall":200,"terrainBreakdown":{"beginner":0.28,"intermediate":0.24,"advanced":0.33},"rating":3.1,"ratingCount":89},{"id":"kissing-bridge","name":"Kissing Bridge","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.60746,"lon":-78.65278,"vertical":550,"trails":28,"lifts":9,"acres":78,"longestRun":0.5,"snowmaking":55000,"price":84,"night":true,"terrainPark":false,"baseElevation":1150,"summitElevation":1700,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.2,"intermediate":0.5,"advanced":0.3},"rating":3.1,"ratingCount":18},{"id":"labrador-mt","name":"Labrador Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.74179,"lon":-76.03021,"vertical":700,"trails":32,"lifts":3,"acres":128,"longestRun":1.0,"snowmaking":23700,"price":88,"night":false,"terrainPark":false,"baseElevation":1125,"summitElevation":1825,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.9,"ratingCount":14},{"id":"maple-ski-ridge","name":"Maple Ski Ridge","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.81776,"lon":-74.03162,"vertical":450,"trails":25,"lifts":2,"acres":56,"longestRun":0.3,"snowmaking":2500,"price":69,"night":true,"terrainPark":false,"baseElevation":750,"summitElevation":1200,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.11,"intermediate":0.44,"advanced":0.44},"rating":2.4,"ratingCount":3},{"id":"mccauley-mountain-ski-center","name":"McCauley Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.69719,"lon":-74.96616,"vertical":633,"trails":30,"lifts":5,"acres":79,"longestRun":0.3,"snowmaking":5500,"price":74,"night":false,"terrainPark":true,"baseElevation":1563,"summitElevation":2250,"avgSnowfall":152,"terrainBreakdown":{"beginner":0.26,"intermediate":0.43,"advanced":0.3},"rating":3.3,"ratingCount":13},{"id":"mount-peter-ski-area","name":"Mount Peter","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.2478,"lon":-74.29519,"vertical":450,"trails":25,"lifts":5,"acres":83,"longestRun":1.0,"snowmaking":6900,"price":86,"night":false,"terrainPark":false,"baseElevation":750,"summitElevation":1250,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.43,"intermediate":0.21,"advanced":0.21},"rating":3.2,"ratingCount":43},{"id":"oak-mountain","name":"Oak Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.51812,"lon":-74.36221,"vertical":650,"trails":31,"lifts":3,"acres":130,"longestRun":1.2,"snowmaking":1800,"price":77,"night":false,"terrainPark":false,"baseElevation":1750,"summitElevation":2400,"avgSnowfall":160,"terrainBreakdown":{"beginner":0.45,"intermediate":0.27,"advanced":0.18},"rating":0.0,"ratingCount":0},{"id":"peekn-peak","name":"Peek\u2019n Peak","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.06204,"lon":-79.7356,"vertical":400,"trails":23,"lifts":2,"acres":120,"longestRun":2.4,"snowmaking":11000,"price":85,"night":true,"terrainPark":true,"baseElevation":1400,"summitElevation":1800,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.45,"advanced":0.15},"rating":3.3,"ratingCount":58},{"id":"plattekill-mountain","name":"Plattekill","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.10731,"lon":-74.08652,"vertical":1100,"trails":43,"lifts":3,"acres":293,"longestRun":2.0,"snowmaking":7500,"price":99,"night":false,"terrainPark":false,"baseElevation":2400,"summitElevation":3500,"avgSnowfall":215,"terrainBreakdown":{"beginner":0.2,"intermediate":0.4,"advanced":0.2},"rating":3.2,"ratingCount":25},{"id":"royal-mountain-ski-area","name":"Royal Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.0813,"lon":-74.50481,"vertical":550,"trails":28,"lifts":3,"acres":69,"longestRun":0.3,"snowmaking":2800,"price":83,"night":false,"terrainPark":false,"baseElevation":1250,"summitElevation":1800,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":3.1,"ratingCount":7},{"id":"snow-ridge","name":"Snow Ridge","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.02733,"lon":-74.10883,"vertical":650,"trails":31,"lifts":6,"acres":108,"longestRun":0.8,"snowmaking":6500,"price":75,"night":true,"terrainPark":false,"baseElevation":1350,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.14,"intermediate":0.33,"advanced":0.33},"rating":2.6,"ratingCount":7},{"id":"song-mountain","name":"Song Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.77422,"lon":-76.15877,"vertical":700,"trails":32,"lifts":4,"acres":93,"longestRun":0.4,"snowmaking":7000,"price":83,"night":true,"terrainPark":false,"baseElevation":1240,"summitElevation":1940,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.5,"intermediate":0.29,"advanced":0.13},"rating":2.6,"ratingCount":9},{"id":"swain","name":"Swain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.47784,"lon":-77.85333,"vertical":650,"trails":31,"lifts":5,"acres":119,"longestRun":1.0,"snowmaking":9000,"price":78,"night":false,"terrainPark":false,"baseElevation":1320,"summitElevation":1970,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.27,"intermediate":0.39,"advanced":0.33},"rating":3.1,"ratingCount":13},{"id":"thunder-ridge","name":"Thunder Ridge","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.50793,"lon":-73.58608,"vertical":500,"trails":26,"lifts":5,"acres":67,"longestRun":0.4,"snowmaking":10000,"price":83,"night":false,"terrainPark":false,"baseElevation":770,"summitElevation":1270,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.4,"intermediate":0.4,"advanced":0.2},"rating":3.1,"ratingCount":29},{"id":"titus-mountain","name":"Titus Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.76575,"lon":-74.23398,"vertical":1200,"trails":46,"lifts":8,"acres":320,"longestRun":2.0,"snowmaking":15000,"price":90,"night":true,"terrainPark":false,"baseElevation":825,"summitElevation":2025,"avgSnowfall":141,"terrainBreakdown":{"beginner":0.34,"intermediate":0.38,"advanced":0.22},"rating":3.2,"ratingCount":15},{"id":"toggenburg-mountain","name":"Toggenburg","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.82624,"lon":-75.95988,"vertical":700,"trails":32,"lifts":4,"acres":93,"longestRun":0.4,"snowmaking":0,"price":84,"night":false,"terrainPark":false,"baseElevation":1300,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.33,"advanced":0.34},"rating":2.9,"ratingCount":11},{"id":"west-mountain","name":"West Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.69376,"lon":-74.12347,"vertical":1010,"trails":41,"lifts":4,"acres":151,"longestRun":0.6,"snowmaking":10500,"price":79,"night":true,"terrainPark":false,"baseElevation":460,"summitElevation":1470,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.55,"advanced":0.09},"rating":3.0,"ratingCount":27},{"id":"whiteface-mountain-resort","name":"Whiteface","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.29706,"lon":-74.01057,"vertical":3430,"trails":110,"lifts":7,"acres":943,"longestRun":2.1,"snowmaking":22000,"price":123,"night":false,"terrainPark":false,"baseElevation":1220,"summitElevation":4650,"avgSnowfall":272,"terrainBreakdown":{"beginner":0.2,"intermediate":0.42,"advanced":0.38},"rating":3.2,"ratingCount":68},{"id":"willard-mountain","name":"Willard Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.02066,"lon":-73.51588,"vertical":505,"trails":26,"lifts":5,"acres":67,"longestRun":0.4,"snowmaking":3500,"price":83,"night":false,"terrainPark":false,"baseElevation":910,"summitElevation":1415,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.1,"ratingCount":7},{"id":"windham-mountain","name":"Windham Mountain","state":"NY","region":"New York","passGroup":"Ikon","ownerGroup":"Ikon network","lat":42.29373,"lon":-74.25671,"vertical":1600,"trails":58,"lifts":6,"acres":427,"longestRun":2.0,"snowmaking":28000,"price":140,"night":false,"terrainPark":true,"baseElevation":1500,"summitElevation":3100,"avgSnowfall":195,"terrainBreakdown":{"beginner":0.3,"intermediate":0.43,"advanced":0.16},"rating":3.3,"ratingCount":48},{"id":"woods-valley-ski-area","name":"Woods Valley","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.30267,"lon":-75.38476,"vertical":500,"trails":26,"lifts":6,"acres":62,"longestRun":0.3,"snowmaking":1600,"price":81,"night":false,"terrainPark":false,"baseElevation":900,"summitElevation":1400,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.2},"rating":2.9,"ratingCount":9},{"id":"bear-creek-mountain-resort","name":"Bear Creek","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.47533,"lon":-75.6253,"vertical":510,"trails":27,"lifts":5,"acres":94,"longestRun":1.0,"snowmaking":8600,"price":83,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":1100,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":55},{"id":"big-boulder","name":"Big Boulder","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.11,"lon":-75.65123,"vertical":600,"trails":29,"lifts":6,"acres":60,"longestRun":0.0,"snowmaking":5500,"price":117,"night":true,"terrainPark":false,"baseElevation":1700,"summitElevation":2175,"avgSnowfall":99,"terrainBreakdown":{"beginner":1.0,"intermediate":0.0,"advanced":0.0},"rating":3.1,"ratingCount":36},{"id":"blue-knob","name":"Blue Knob","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.28841,"lon":-78.56168,"vertical":1072,"trails":43,"lifts":3,"acres":286,"longestRun":2.0,"snowmaking":8400,"price":95,"night":false,"terrainPark":false,"baseElevation":2074,"summitElevation":3146,"avgSnowfall":147,"terrainBreakdown":{"beginner":0.15,"intermediate":0.41,"advanced":0.26},"rating":3.2,"ratingCount":42},{"id":"blue-mountain-ski-area","name":"Blue Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.82264,"lon":-75.51248,"vertical":1082,"trails":43,"lifts":13,"acres":216,"longestRun":1.2,"snowmaking":16400,"price":91,"night":true,"terrainPark":true,"baseElevation":460,"summitElevation":1600,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.41,"intermediate":0.13,"advanced":0.13},"rating":3.5,"ratingCount":154},{"id":"camelback-mountain-resort","name":"Camelback","state":"PA","region":"Pennsylvania","passGroup":"Ikon","ownerGroup":"Ikon network","lat":41.05149,"lon":-75.35518,"vertical":800,"trails":35,"lifts":11,"acres":147,"longestRun":1.0,"snowmaking":16000,"price":122,"night":true,"terrainPark":true,"baseElevation":1250,"summitElevation":2100,"avgSnowfall":95,"terrainBreakdown":{"beginner":0.32,"intermediate":0.32,"advanced":0.32},"rating":3.2,"ratingCount":126},{"id":"eagle-rock","name":"Eagle Rock","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.20268,"lon":-75.37779,"vertical":550,"trails":28,"lifts":3,"acres":101,"longestRun":1.0,"snowmaking":0,"price":83,"night":false,"terrainPark":false,"baseElevation":1260,"summitElevation":1810,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.5,"intermediate":0.07,"advanced":0.43},"rating":3.1,"ratingCount":12},{"id":"elk-mountain-ski-resort","name":"Elk Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.72051,"lon":-75.5593,"vertical":1000,"trails":41,"lifts":7,"acres":158,"longestRun":0.7,"snowmaking":14600,"price":86,"night":false,"terrainPark":false,"baseElevation":1693,"summitElevation":2693,"avgSnowfall":125,"terrainBreakdown":{"beginner":0.22,"intermediate":0.37,"advanced":0.41},"rating":3.3,"ratingCount":96},{"id":"jack-frost","name":"Jack Frost","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.11,"lon":-75.65123,"vertical":600,"trails":29,"lifts":7,"acres":110,"longestRun":1.0,"snowmaking":10000,"price":124,"night":true,"terrainPark":false,"baseElevation":1400,"summitElevation":2000,"avgSnowfall":90,"terrainBreakdown":{"beginner":1.0,"intermediate":0.0,"advanced":0.0},"rating":3.2,"ratingCount":42},{"id":"liberty","name":"Liberty Mountain","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.55841,"lon":-77.10469,"vertical":620,"trails":30,"lifts":8,"acres":114,"longestRun":1.0,"snowmaking":10000,"price":124,"night":true,"terrainPark":false,"baseElevation":570,"summitElevation":1190,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.35,"intermediate":0.4,"advanced":0.0},"rating":3.1,"ratingCount":62},{"id":"montage-mountain","name":"Montage Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.39871,"lon":-75.63755,"vertical":1000,"trails":41,"lifts":4,"acres":200,"longestRun":1.2,"snowmaking":14000,"price":90,"night":true,"terrainPark":true,"baseElevation":960,"summitElevation":1960,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.35,"intermediate":0.3,"advanced":0.2},"rating":3.4,"ratingCount":124},{"id":"mount-pleasant-of-edinboro","name":"Mount Pleasant of Edinboro","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.85099,"lon":-80.07029,"vertical":340,"trails":22,"lifts":1,"acres":48,"longestRun":0.5,"snowmaking":3500,"price":79,"night":false,"terrainPark":false,"baseElevation":1200,"summitElevation":1540,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.22,"intermediate":0.56,"advanced":0.22},"rating":3.3,"ratingCount":3},{"id":"roundtop-mountain-resort","name":"Roundtop","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":40.10945,"lon":-76.92755,"vertical":600,"trails":29,"lifts":6,"acres":80,"longestRun":0.4,"snowmaking":10300,"price":119,"night":false,"terrainPark":false,"baseElevation":800,"summitElevation":1400,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.2,"intermediate":0.25,"advanced":0.4},"rating":2.9,"ratingCount":39},{"id":"seven-springs","name":"Seven Springs","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.02298,"lon":-79.29771,"vertical":750,"trails":33,"lifts":7,"acres":150,"longestRun":1.2,"snowmaking":28500,"price":86,"night":false,"terrainPark":true,"baseElevation":2240,"summitElevation":2994,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.42,"advanced":0.18},"rating":3.1,"ratingCount":120},{"id":"shawnee-mountain-ski-area","name":"Shawnee Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.03961,"lon":-75.08526,"vertical":700,"trails":32,"lifts":8,"acres":163,"longestRun":1.6,"snowmaking":12500,"price":88,"night":false,"terrainPark":false,"baseElevation":650,"summitElevation":1350,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.26,"intermediate":0.48,"advanced":0.26},"rating":3.2,"ratingCount":35},{"id":"ski-big-bear","name":"Ski Big Bear","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.52398,"lon":-75.0233,"vertical":650,"trails":31,"lifts":6,"acres":146,"longestRun":1.5,"snowmaking":2600,"price":87,"night":false,"terrainPark":false,"baseElevation":600,"summitElevation":1250,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.33,"intermediate":0.28,"advanced":0.33},"rating":3.1,"ratingCount":28},{"id":"big-bear","name":"Ski Big Bear at Masthope","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.52242,"lon":-75.02357,"vertical":500,"trails":26,"lifts":2,"acres":92,"longestRun":1.0,"snowmaking":50,"price":59,"night":true,"terrainPark":false,"baseElevation":500,"summitElevation":1200,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.28,"intermediate":0.42,"advanced":0.3},"rating":3.5,"ratingCount":0},{"id":"ski-sawmill","name":"Ski Sawmill","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5186,"lon":-77.29075,"vertical":515,"trails":27,"lifts":4,"acres":56,"longestRun":0.1,"snowmaking":1300,"price":78,"night":false,"terrainPark":false,"baseElevation":1700,"summitElevation":2215,"avgSnowfall":101,"terrainBreakdown":{"beginner":0.35,"intermediate":0.25,"advanced":0.4},"rating":3.2,"ratingCount":14},{"id":"sno-mountain","name":"Sno Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.35124,"lon":-75.66292,"vertical":500,"trails":26,"lifts":2,"acres":92,"longestRun":1.0,"snowmaking":50,"price":59,"night":false,"terrainPark":false,"baseElevation":500,"summitElevation":1200,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.28,"intermediate":0.42,"advanced":0.3},"rating":3.5,"ratingCount":0},{"id":"spring-mountain-ski-area","name":"Spring Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.27254,"lon":-75.45006,"vertical":450,"trails":25,"lifts":5,"acres":52,"longestRun":0.2,"snowmaking":4500,"price":77,"night":false,"terrainPark":false,"baseElevation":78,"summitElevation":528,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.37,"intermediate":0.5,"advanced":0.13},"rating":3.0,"ratingCount":52},{"id":"tussey-mountain","name":"Tussey Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.21,"lon":-78.33222,"vertical":520,"trails":27,"lifts":5,"acres":65,"longestRun":0.3,"snowmaking":3000,"price":78,"night":false,"terrainPark":false,"baseElevation":1230,"summitElevation":1750,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.4,"intermediate":0.4,"advanced":0.0},"rating":3.0,"ratingCount":12},{"id":"whitetail-resort","name":"Whitetail","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":39.74177,"lon":-77.93328,"vertical":935,"trails":39,"lifts":7,"acres":171,"longestRun":1.0,"snowmaking":12000,"price":127,"night":false,"terrainPark":true,"baseElevation":865,"summitElevation":1800,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.32,"intermediate":0.45,"advanced":0.0},"rating":3.2,"ratingCount":61},{"id":"yawgoo-valley","name":"Yawgoo Valley","state":"RI","region":"Rhode Island","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5176,"lon":-71.52726,"vertical":245,"trails":19,"lifts":4,"acres":29,"longestRun":0.2,"snowmaking":3000,"price":71,"night":true,"terrainPark":false,"baseElevation":70,"summitElevation":315,"avgSnowfall":60,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.3,"ratingCount":5},{"id":"bolton-valley","name":"Bolton Valley","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.42099,"lon":-72.85033,"vertical":1704,"trails":61,"lifts":6,"acres":256,"longestRun":0.6,"snowmaking":9000,"price":86,"night":true,"terrainPark":false,"baseElevation":1446,"summitElevation":3150,"avgSnowfall":238,"terrainBreakdown":{"beginner":0.34,"intermediate":0.38,"advanced":0.23},"rating":3.2,"ratingCount":34},{"id":"bromley-mountain","name":"Bromley","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.22785,"lon":-72.93871,"vertical":1334,"trails":50,"lifts":7,"acres":411,"longestRun":2.5,"snowmaking":15500,"price":104,"night":true,"terrainPark":false,"baseElevation":1950,"summitElevation":3284,"avgSnowfall":244,"terrainBreakdown":{"beginner":0.3,"intermediate":0.36,"advanced":0.32},"rating":3.2,"ratingCount":24},{"id":"burke-mountain","name":"Burke Mountain","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.57117,"lon":-71.89232,"vertical":2011,"trails":69,"lifts":4,"acres":570,"longestRun":2.2,"snowmaking":12500,"price":99,"night":false,"terrainPark":false,"baseElevation":1210,"summitElevation":3267,"avgSnowfall":243,"terrainBreakdown":{"beginner":0.11,"intermediate":0.46,"advanced":0.34},"rating":3.2,"ratingCount":23},{"id":"jay-peak","name":"Jay Peak","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.93794,"lon":-72.50452,"vertical":2153,"trails":74,"lifts":6,"acres":754,"longestRun":3.0,"snowmaking":30000,"price":107,"night":false,"terrainPark":true,"baseElevation":1815,"summitElevation":3968,"avgSnowfall":278,"terrainBreakdown":{"beginner":0.2,"intermediate":0.4,"advanced":0.4},"rating":3.5,"ratingCount":111},{"id":"killington-resort","name":"Killington","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.6198,"lon":-72.80271,"vertical":3050,"trails":99,"lifts":11,"acres":1830,"longestRun":6.0,"snowmaking":50000,"price":179,"night":false,"terrainPark":true,"baseElevation":1165,"summitElevation":4241,"avgSnowfall":292,"terrainBreakdown":{"beginner":0.28,"intermediate":0.33,"advanced":0.24},"rating":3.6,"ratingCount":174},{"id":"mad-river-glen","name":"Mad River Glen","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.20248,"lon":-72.91754,"vertical":2037,"trails":70,"lifts":3,"acres":373,"longestRun":1.0,"snowmaking":1600,"price":102,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":3637,"avgSnowfall":262,"terrainBreakdown":{"beginner":0.2,"intermediate":0.35,"advanced":0.45},"rating":3.2,"ratingCount":26},{"id":"magic-mountain","name":"Magic Mountain","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.20171,"lon":-72.77264,"vertical":1500,"trails":55,"lifts":3,"acres":350,"longestRun":1.6,"snowmaking":9500,"price":91,"night":false,"terrainPark":false,"baseElevation":1350,"summitElevation":2850,"avgSnowfall":222,"terrainBreakdown":{"beginner":0.3,"intermediate":0.3,"advanced":0.15},"rating":3.3,"ratingCount":27},{"id":"middlebury-snow-bowl","name":"Middlebury Snow Bowl","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.9612,"lon":-73.0122,"vertical":1020,"trails":17,"lifts":4,"acres":100,"longestRun":1.2,"snowmaking":80,"price":69,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":2620,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.22,"intermediate":0.4,"advanced":0.38},"rating":3.8,"ratingCount":50},{"id":"mount-snow","name":"Mount Snow","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":42.96368,"lon":-72.88753,"vertical":1700,"trails":61,"lifts":10,"acres":453,"longestRun":2.0,"snowmaking":48000,"price":146,"night":false,"terrainPark":true,"baseElevation":1900,"summitElevation":3600,"avgSnowfall":260,"terrainBreakdown":{"beginner":0.14,"intermediate":0.73,"advanced":0.13},"rating":3.4,"ratingCount":106},{"id":"okemo-mountain-resort","name":"Okemo","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":43.40156,"lon":-72.717,"vertical":2200,"trails":75,"lifts":12,"acres":953,"longestRun":4.0,"snowmaking":65400,"price":164,"night":false,"terrainPark":true,"baseElevation":1144,"summitElevation":3344,"avgSnowfall":247,"terrainBreakdown":{"beginner":0.32,"intermediate":0.37,"advanced":0.23},"rating":3.8,"ratingCount":100},{"id":"pico-mountain-at-killington","name":"Pico","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.65136,"lon":-72.841,"vertical":1967,"trails":68,"lifts":3,"acres":852,"longestRun":4.0,"snowmaking":15600,"price":156,"night":false,"terrainPark":true,"baseElevation":2000,"summitElevation":3967,"avgSnowfall":278,"terrainBreakdown":{"beginner":0.18,"intermediate":0.46,"advanced":0.33},"rating":3.4,"ratingCount":29},{"id":"suicide-six","name":"Saskadena Six","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.66506,"lon":-72.54327,"vertical":650,"trails":31,"lifts":3,"acres":87,"longestRun":0.4,"snowmaking":5000,"price":75,"night":false,"terrainPark":false,"baseElevation":550,"summitElevation":1200,"avgSnowfall":180,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":12},{"id":"smugglers-notch-resort","name":"Smugglers' Notch","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.58847,"lon":-72.79005,"vertical":2610,"trails":87,"lifts":8,"acres":914,"longestRun":3.0,"snowmaking":19200,"price":120,"night":false,"terrainPark":true,"baseElevation":1030,"summitElevation":3640,"avgSnowfall":262,"terrainBreakdown":{"beginner":0.19,"intermediate":0.5,"advanced":0.25},"rating":3.3,"ratingCount":71},{"id":"stowe-mountain-resort","name":"Stowe","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":44.52973,"lon":-72.77927,"vertical":2360,"trails":79,"lifts":9,"acres":964,"longestRun":3.7,"snowmaking":38800,"price":162,"night":false,"terrainPark":true,"baseElevation":2035,"summitElevation":4395,"avgSnowfall":300,"terrainBreakdown":{"beginner":0.16,"intermediate":0.55,"advanced":0.15},"rating":3.3,"ratingCount":77},{"id":"stratton-mountain","name":"Stratton","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.11344,"lon":-72.90813,"vertical":2003,"trails":69,"lifts":6,"acres":701,"longestRun":3.0,"snowmaking":57000,"price":150,"night":false,"terrainPark":true,"baseElevation":1872,"summitElevation":3875,"avgSnowfall":274,"terrainBreakdown":{"beginner":0.41,"intermediate":0.31,"advanced":0.17},"rating":3.2,"ratingCount":90},{"id":"sugarbush","name":"Sugarbush","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.13611,"lon":-72.89442,"vertical":2600,"trails":86,"lifts":9,"acres":910,"longestRun":3.0,"snowmaking":35600,"price":157,"night":false,"terrainPark":true,"baseElevation":1483,"summitElevation":4083,"avgSnowfall":284,"terrainBreakdown":{"beginner":0.23,"intermediate":0.42,"advanced":0.27},"rating":3.4,"ratingCount":83}];

// ─── Named scoring constants (audit #32) ─────────────────────────────────────
const SCORING = Object.freeze({
  SNOWMAKING_MAX:  65400, // Okemo — highest in dataset
  VERTICAL_MAX:    3430,  // Whiteface
  DRIVE_SCALE:       300, // minutes — 5 hrs = zero drive score
  SNOW_SCALE:          8, // inches — 8"+ = max snow score
  PRICE_MAX:         180,
  PRICE_MIN:          35,
  CROWD_SCALE:        85,
  DRIVE_DEFAULT:     0.5, // fallback when no origin set (audit #18)
});

// Pass break-even prices (audit #39)
const PASS_PRICES = Object.freeze({ Indy: 349, Epic: 909, Ikon: 799 });

const PRESETS = {
  balanced: { snow:40, drive:20, snowmaking:15, vertical:15, price:10, crowd:10 },
  powder:   { snow:50, drive:10, snowmaking:10, vertical:20, price:5,  crowd:5  },
  family:   { snow:20, drive:20, snowmaking:25, vertical:10, price:15, crowd:20 },
  cheap:    { snow:10, drive:30, snowmaking:15, vertical:10, price:30, crowd:5  },
  indy:     { snow:25, drive:20, snowmaking:15, vertical:15, price:10, crowd:15 },
};

// Pre-computed — RESORTS is a compile-time constant (audit #37)
const UNIQUE_STATES = Object.freeze(['All', ...new Set(RESORTS.map(r => r.state))].sort());
const UNIQUE_PASSES = Object.freeze(['All', 'Epic', 'Ikon', 'Indy', 'Independent']);

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// Minimal HTML escaper — guard against any future XSS surface (audit #23)
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ─── History cache (outside sealed state — grows dynamically) ────────────────
const historyCache = new Map(); // resortId → { total, days:[{date,snow}], ts }
const HIST_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── State ───────────────────────────────────────────────────────────────────
function loadSavedWeights() {        // audit #19 — safe localStorage read
  try {
    const raw = localStorage.getItem('ski-planner-weights');
    return raw ? JSON.parse(raw) : { ...PRESETS.balanced };
  } catch (e) {
    localStorage.removeItem('ski-planner-weights');
    return { ...PRESETS.balanced };
  }
}
function loadSavedPreset() {
  try { return localStorage.getItem('ski-planner-preset') || 'balanced'; } catch (e) { return 'balanced'; }
}
function loadSavedSkiDays() {
  try { return Number(localStorage.getItem('ski-ski-days') || 5); } catch (e) { return 5; }
}

const state = Object.seal({        // audit #4 — seal prevents silent property additions
  search:       '',
  passFilter:   'All',
  stateFilter:  'All',
  sortBy:       'planner',
  nightOnly:    false,
  maxDrive:     0,
  selectedId:   null,
  origin:       null,
  driveCache:   {},
  weatherCache: {},
  compareSet:   new Set(),
  mapMode:      'drive',
  preset:       loadSavedPreset(),
  weights:      loadSavedWeights(),
  skiDays:      loadSavedSkiDays(),
});

// ─── Element cache ────────────────────────────────────────────────────────────
const els = {
  verdictSection:      $('verdictSection'),
  verdictCard:         $('verdictCard'),
  summaryCards:        $('summaryCards'),
  searchInput:         $('searchInput'),
  resortSuggestions:   $('resortSuggestions'),
  passFilter:          $('passFilter'),
  stateFilter:         $('stateFilter'),
  maxDriveFilter:      $('maxDriveFilter'),
  sortBy:              $('sortBy'),
  toggleNight:         $('toggleNight'),
  resetFilters:        $('resetFilters'),
  activeFilters:       $('activeFilters'),
  originInput:         $('originInput'),
  setLocation:         $('setLocation'),
  detectLocation:      $('detectLocation'),
  locationStatus:      $('locationStatus'),
  jumpTomorrow:        $('jumpTomorrow'),
  jumpWeekend:         $('jumpWeekend'),
  weightSummary:       $('weightSummary'),
  snowWeight:          $('snowWeight'),       driveWeight:       $('driveWeight'),
  snowmakingWeight:    $('snowmakingWeight'), verticalWeight:    $('verticalWeight'),
  priceWeight:         $('priceWeight'),      crowdWeight:       $('crowdWeight'),
  snowWeightVal:       $('snowWeightVal'),    driveWeightVal:    $('driveWeightVal'),
  snowmakingWeightVal: $('snowmakingWeightVal'), verticalWeightVal: $('verticalWeightVal'),
  priceWeightVal:      $('priceWeightVal'),   crowdWeightVal:    $('crowdWeightVal'),
  tomorrowGrid:        $('tomorrowGrid'),     weekendGrid:       $('weekendGrid'),
  stormGrid:           $('stormGrid'),        hiddenGemGrid:     $('hiddenGemGrid'),
  indyGrid:            $('indyGrid'),         passCalcGrid:      $('passCalcGrid'),
  skiDays:             $('skiDays'),
  resultCount:         $('resultCount'),
  comparisonBody:      $('comparisonBody'),
  compareTray:         $('compareTray'),
  comparePills:        $('comparePills'),
  compareBtn:          $('compareBtn'),
  clearCompare:        $('clearCompare'),
  comparePanel:        $('comparePanel'),
  compareContent:      $('compareContent'),
  closeCompare:        $('closeCompare'),
  detailSection:       $('detailSection'),
  detailCard:          $('detailCard'),
  mapLegend:           $('mapLegend'),
  backToTop:           $('backToTop'),
  toast:               $('toast'),
};

// Cached querySelectorAll results — avoid re-querying on every syncPlannerControls (audit #14)
let _presetBtns = null, _mapModeBtns = null;
const presetBtns  = () => _presetBtns  || (_presetBtns  = [...document.querySelectorAll('.preset-btn')]);
const mapModeBtns = () => _mapModeBtns || (_mapModeBtns = [...document.querySelectorAll('.map-mode-btn')]);

// ─── Utilities ────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(message, dur = 2600) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), dur);
}

// Debounce factory (audit #7, #8)
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHAREABLE URL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function serializeState() {
  const p = new URLSearchParams();
  if (state.preset !== 'balanced')  p.set('preset', state.preset);
  if (state.preset === 'custom') {
    const w = state.weights;
    p.set('w', [w.snow, w.drive, w.snowmaking, w.vertical, w.price, w.crowd].join(','));
  }
  if (state.passFilter  !== 'All')     p.set('pass',  state.passFilter);
  if (state.stateFilter !== 'All')     p.set('st',    state.stateFilter);
  if (state.sortBy      !== 'planner') p.set('sort',  state.sortBy);
  if (state.nightOnly)                 p.set('night', '1');
  if (state.maxDrive > 0)              p.set('drive', state.maxDrive);
  if (state.skiDays  !== 5)            p.set('days',  state.skiDays);
  if (state.origin) {
    p.set('lat', state.origin.lat.toFixed(4));
    p.set('lon', state.origin.lon.toFixed(4));
    p.set('loc', state.origin.label);
  }
  return p;
}

// Returns true if URL contained state to restore
function applyUrlState() {
  const p = new URLSearchParams(window.location.search);
  if (!p.toString()) return false;

  const preset = p.get('preset');
  if (preset && PRESETS[preset]) {
    state.preset  = preset;
    state.weights = { ...PRESETS[preset] };
  }
  if (preset === 'custom') {
    const wStr = p.get('w');
    if (wStr) {
      const parts = wStr.split(',').map(Number);
      const [snow, drive, snowmaking, vertical, price, crowd] = parts;
      if (parts.length === 6 && parts.every(n => !isNaN(n) && n >= 0)) {
        state.weights = { snow, drive, snowmaking, vertical, price, crowd };
      }
    }
  }
  if (p.has('pass')  && UNIQUE_PASSES.includes(p.get('pass')))  state.passFilter  = p.get('pass');
  if (p.has('st')    && UNIQUE_STATES.includes(p.get('st')))    state.stateFilter = p.get('st');
  if (p.has('sort'))  state.sortBy    = p.get('sort');
  if (p.has('night')) state.nightOnly = true;
  if (p.has('drive')) state.maxDrive  = Number(p.get('drive')) || 0;
  if (p.has('days'))  state.skiDays   = Math.max(1, Number(p.get('days')) || 5);

  const lat = parseFloat(p.get('lat'));
  const lon = parseFloat(p.get('lon'));
  const loc = p.get('loc');
  if (!isNaN(lat) && !isNaN(lon) && loc) {
    state.origin = { lat, lon, label: loc };
  }
  return true;
}

const pushUrlDebounced = debounce(() => {
  const p = serializeState();
  const url = p.toString() ? `${location.pathname}?${p}` : location.pathname;
  history.replaceState(null, '', url);
}, 600);

function copyShareLink() {
  const p   = serializeState();
  const url = `${location.origin}${location.pathname}${p.toString() ? '?' + p : ''}`;
  const doToast = () => showToast('🔗 Link copied — share it with your crew!', 3200);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(doToast).catch(() => fallbackCopy(url));
  } else { fallbackCopy(url); }
}
function fallbackCopy(text) {
  const ta = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0',
  });
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showToast('🔗 Link copied!', 3200); } catch(e) {}
  document.body.removeChild(ta);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORICAL SNOWFALL — last 7 days via Open-Meteo archive API
// ═══════════════════════════════════════════════════════════════════════════════

function historyDateRange() {
  const end   = new Date(); end.setDate(end.getDate() - 1);       // yesterday
  const start = new Date(end); start.setDate(end.getDate() - 6);  // 7 days back
  const fmt   = d => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

async function fetchHistory(resort) {
  const cached = historyCache.get(resort.id);
  if (cached && Date.now() - cached.ts < HIST_TTL) return cached;
  try {
    const { start, end } = historyDateRange();
    const url = `https://archive-api.open-meteo.com/v1/archive?` +
      `latitude=${resort.lat}&longitude=${resort.lon}` +
      `&start_date=${start}&end_date=${end}` +
      `&daily=snowfall_sum&timezone=America%2FNew_York`;
    const res  = await fetchWithTimeout(url, {}, 10000);
    const data = await res.json();
    const days  = (data.daily?.time || []).map((date, i) => ({
      date,
      snow: Math.round((data.daily.snowfall_sum?.[i] || 0) * 10) / 10,
    }));
    const total = Math.round(days.reduce((s, d) => s + d.snow, 0) * 10) / 10;
    const entry = { total, days, ts: Date.now() };
    historyCache.set(resort.id, entry);
    return entry;
  } catch (e) { return null; }
}

async function ensureHistory(resorts) {
  const queue = resorts.filter(r => !historyCache.has(r.id));
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (r) await fetchHistory(r);
    }
  }));
  saveHistoryCache();
}

function loadHistoryCache() {
  try {
    const raw = sessionStorage.getItem('ski-hist-cache');
    if (!raw) return;
    const now = Date.now();
    Object.entries(JSON.parse(raw)).forEach(([id, entry]) => {
      if (now - entry.ts < HIST_TTL) historyCache.set(id, entry);
    });
  } catch (e) { /* ignore */ }
}

function saveHistoryCache() {
  try {
    const obj = {};
    historyCache.forEach((v, k) => { obj[k] = v; });
    sessionStorage.setItem('ski-hist-cache', JSON.stringify(obj));
  } catch (e) { /* quota exceeded */ }
}

// Inline SVG bar sparkline — one bar per day, colour-coded by intensity
function snowSparkline(days) {
  if (!days?.length) return '';
  const maxVal = Math.max(...days.map(d => d.snow), 0.5);
  const W = 7, GAP = 3, H = 22;
  const bars = days.map((d, i) => {
    const barH = d.snow > 0 ? Math.max(3, Math.round(d.snow / maxVal * H)) : 2;
    const fill = d.snow >= 4 ? '#1d4ed8' : d.snow >= 1 ? '#2b6de9' : d.snow > 0 ? '#93c5fd' : '#dde5f0';
    return `<rect x="${i*(W+GAP)}" y="${H-barH}" width="${W}" height="${barH}" rx="1" fill="${fill}"><title>${d.date}: ${d.snow}"</title></rect>`;
  });
  const svgW = days.length * (W + GAP) - GAP;
  return `<svg width="${svgW}" height="${H}" viewBox="0 0 ${svgW} ${H}" class="snow-sparkline" aria-label="7-day snowfall chart">${bars.join('')}</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// "SHOULD I GO?" VERDICT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

// Environmental lapse rate: ~3.5°F per 1000 ft elevation gain
function summitTempF(baseTempF, baseElevFt, summitElevFt) {
  return baseTempF - ((summitElevFt - baseElevFt) / 1000) * 3.5;
}

function computeVerdict(candidates) {
  const withWx = candidates.filter(r => state.weatherCache[r.id]?.data);
  if (!withWx.length) return null;

  const w      = normalizedWeights();
  const ranked = withWx.map(r => {
    const wx = state.weatherCache[r.id].data;
    return {
      resort:    r,
      wx,
      breakdown: plannerScoreBreakdown(r, wx, 0, w),
      history:   historyCache.get(r.id) || null,
    };
  }).sort((a, b) => b.breakdown.score - a.breakdown.score);

  const { resort, wx, breakdown, history } = ranked[0];
  const forecast   = wx.forecast || [];
  const tomorrowIn = forecast[0]?.snow || 0;
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const histTotal  = history?.total ?? null;
  const histDays   = history?.days ?? null;

  // Freeze-line estimate using tomorrow's base lo temp
  const baseLo    = forecast[0]?.lo ?? 30;
  const sLo       = summitTempF(baseLo, resort.baseElevation, resort.summitElevation);
  const rainLikely  = sLo > 34;
  const warmCaution = sLo > 28 && !rainLikely;
  const coldSnow    = sLo <= 24;

  const smRating  = snowmakingRating(resort.snowmaking);
  const drive     = getDriveMins(resort.id);
  const driveText = drive !== null ? formatDrive(resort.id) : '';

  let tier, icon, headline, detail, subPoints = [];

  if (rainLikely) {
    tier = 'bad'; icon = '🌧️'; headline = 'Skip this weekend';
    detail = `Temperatures look too warm — rain likely above ${resort.baseElevation.toLocaleString()} ft at ${esc(resort.name)}. Check back when a colder system moves through.`;
  } else if (stormTotal >= 6 || tomorrowIn >= 4) {
    tier = 'great'; icon = '🎿'; headline = 'Go — excellent weekend for skiing';
    detail = tomorrowIn >= 4
      ? `${tomorrowIn.toFixed(1)}" expected tomorrow at ${esc(resort.name)}. That's a powder day.`
      : `${stormTotal.toFixed(1)}" forecast over the next 3 days. This is what you wait all season for.`;
    if (coldSnow) subPoints.push('Temperatures are ideal — light, dry snow expected');
    if (histTotal !== null && histTotal >= 6) subPoints.push(`${histTotal}" already fell this week, so the base is deep`);
  } else if (stormTotal >= 2 || (histTotal !== null && histTotal >= 6) || smRating >= 65) {
    tier = 'good'; icon = '⛷️'; headline = 'Decent conditions — worth the trip';
    if (stormTotal >= 2) {
      detail = `${stormTotal.toFixed(1)}" in the 3-day forecast at ${esc(resort.name)}. Not a powder day, but fresh snow makes a real difference.`;
    } else if (histTotal !== null && histTotal >= 6) {
      detail = `${histTotal}" fell in the past week at ${esc(resort.name)}. Expect a solid, well-consolidated base even without new snow this weekend.`;
    } else {
      detail = `Light natural snow, but ${esc(resort.name)} has strong snowmaking capacity (${smRating}/100) and temperatures are cold enough to run the guns overnight.`;
    }
    if (warmCaution) subPoints.push('Snow may be dense/wet — get out early for the best runs');
  } else if (stormTotal >= 0.5 || smRating >= 40) {
    tier = 'marginal'; icon = '🤔'; headline = 'Marginal — manage your expectations';
    detail = stormTotal >= 0.5
      ? `Only ${stormTotal.toFixed(1)}" in the forecast at ${esc(resort.name)}. You're mostly working with the existing base — groomed runs will be fine, off-piste less so.`
      : `No new snow expected. Conditions at ${esc(resort.name)} depend entirely on snowmaking — it rates ${smRating}/100 for capacity.`;
    subPoints.push('Stick to groomed trails, get out early, avoid south-facing terrain');
  } else {
    tier = 'bad'; icon = '❌'; headline = 'Probably skip this one';
    detail = `Less than half an inch forecast and limited recent snowfall. ${smRating < 25 ? 'Snowmaking coverage is also thin.' : "You'd be skiing mostly man-made snow on a thin natural base."}`;
  }

  return {
    tier, icon, headline, detail, subPoints,
    resort, breakdown, drive, driveText,
    tomorrowIn, stormTotal, histTotal, histDays,
  };
}

function renderVerdict(candidates) {
  if (!els.verdictSection) return;
  const v = computeVerdict(candidates);
  if (!v) { els.verdictSection.classList.add('hidden'); return; }
  els.verdictSection.classList.remove('hidden');

  const { tier, icon, headline, detail, subPoints,
          resort, breakdown, driveText,
          tomorrowIn, stormTotal, histTotal, histDays } = v;

  const histChip  = histTotal !== null
    ? `<span class="metric-chip">📅 ${histTotal}" last 7 days</span>` : '';
  const driveChip = driveText
    ? `<span class="metric-chip">🚗 ${driveText}</span>` : '';
  const subList   = subPoints.length
    ? `<ul class="verdict-points">${subPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : '';
  const spark     = histDays ? snowSparkline(histDays) : '';
  const noOrigin  = !state.origin
    ? `<p class="verdict-no-origin">📍 Set your starting location for drive times and distance-weighted picks.</p>` : '';

  els.verdictCard.innerHTML = `
    <div class="verdict-inner verdict-${tier}">
      <div class="verdict-left">
        <div class="verdict-icon" aria-hidden="true">${icon}</div>
        <div class="verdict-body">
          <div class="verdict-headline">${headline}</div>
          <div class="verdict-detail">${detail}</div>
          ${subList}
          ${noOrigin}
        </div>
      </div>
      <div class="verdict-right">
        <div class="verdict-pick-block">
          <div class="verdict-pick-label">Top pick</div>
          <div class="verdict-pick-name">${esc(resort.name)}</div>
          <div class="verdict-pick-meta">${esc(resort.state)} · ${esc(resort.passGroup)} · Score ${breakdown.score}</div>
        </div>
        ${spark ? `<div class="verdict-spark-wrap"><span class="verdict-spark-label">Last 7 days</span>${spark}</div>` : ''}
        <div class="verdict-chips">
          <span class="metric-chip">❄️ ${tomorrowIn.toFixed(1)}" tomorrow</span>
          <span class="metric-chip">🌨 ${stormTotal.toFixed(1)}" 3-day</span>
          ${histChip}
          ${driveChip}
        </div>
        <button class="btn btn-secondary verdict-share-btn" id="verdictShareBtn">🔗 Share this plan</button>
      </div>
    </div>`;

  $('verdictShareBtn')?.addEventListener('click', copyShareLink);
}

function savePlannerState() {
  try {
    localStorage.setItem('ski-planner-weights', JSON.stringify(state.weights));
    localStorage.setItem('ski-planner-preset',  state.preset);
    localStorage.setItem('ski-ski-days',         String(state.skiDays));
  } catch (e) { /* quota exceeded — silent */ }
}

function syncPlannerControls() {
  const total = Object.values(state.weights).reduce((s, v) => s + v, 0) || 1;
  const KEYS = [
    ['snow',        'snowWeight',        'snowWeightVal'],
    ['drive',       'driveWeight',       'driveWeightVal'],
    ['snowmaking',  'snowmakingWeight',  'snowmakingWeightVal'],
    ['vertical',    'verticalWeight',    'verticalWeightVal'],
    ['price',       'priceWeight',       'priceWeightVal'],
    ['crowd',       'crowdWeight',       'crowdWeightVal'],
  ];
  KEYS.forEach(([key, inputId, valueId]) => {
    els[inputId].value = state.weights[key];
    els[valueId].textContent = `${Math.round(state.weights[key] / total * 100)}%`;
  });
  els.skiDays.value = state.skiDays;

  const pct = k => Math.round(state.weights[k] / total * 100);
  els.weightSummary.innerHTML =
    `<strong>Actual score influence:</strong> Snow ${pct('snow')}% · Drive ${pct('drive')}% · ` +
    `Snowmaking ${pct('snowmaking')}% · Vertical ${pct('vertical')}% · Price ${pct('price')}% · ` +
    `Crowd penalty ${pct('crowd')}% <span style="color:var(--muted)">(sliders auto-normalize to 100%)</span>`;

  presetBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.preset === state.preset));
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));
}

function applyPreset(name) {
  if (!PRESETS[name]) { console.warn(`Unknown preset: ${name}`); return; } // audit #20
  state.preset = name;
  state.weights = { ...PRESETS[name] };
  savePlannerState();
  syncPlannerControls();
  render();
}

// Compute normalized weights once — callers pass this in to avoid repeated work (audit #5)
function normalizedWeights() {
  const total = Object.values(state.weights).reduce((s, v) => s + v, 0) || 1;
  return Object.fromEntries(Object.entries(state.weights).map(([k, v]) => [k, v / total]));
}

// ─── Drive time helpers ───────────────────────────────────────────────────────
// driveCache entries:
//   { mins, estimated: true, km }  — haversine estimate (phase 1)
//   Number                         — confirmed OSRM minutes (phase 2)
//   null                           — explicitly failed
function getDriveMins(id) {
  const v = state.driveCache[id];
  if (v == null) return null;                          // null or undefined
  return typeof v === 'object' ? v.mins : v;
}
function isDriveEstimated(id) {
  const v = state.driveCache[id];
  return v !== null && typeof v === 'object' && v.estimated;
}

// Two explicit functions with clear contracts — no dual-mode signature (audit #33)
function formatDriveMins(mins, estimated = false) {
  if (mins == null) return '—';
  const p = estimated ? '~' : '';
  if (mins >= 60) { const h = Math.floor(mins / 60), m = mins % 60; return m ? `${p}${h}h ${m}m` : `${p}${h}h`; }
  return `${p}${mins}m`;
}
function formatDrive(resortId) {               // always pass a resort ID (audit #16, #33)
  return formatDriveMins(getDriveMins(resortId), isDriveEstimated(resortId));
}

// ─── Snowmaking helpers ───────────────────────────────────────────────────────
function snowmakingRating(val) { return Math.round(val / SCORING.SNOWMAKING_MAX * 100); }
function snowmakingLabel(val) {
  const p = snowmakingRating(val);
  if (p === 0) return 'None';
  if (p < 10)  return 'Low';
  if (p < 30)  return 'Moderate';
  if (p < 60)  return 'High';
  return 'Very High';
}
function snowmakingDisplay(val) {
  if (val === 0) return 'None';
  return `${snowmakingLabel(val)} (${snowmakingRating(val)}/100)`;
}

// ─── Haversine / drive estimates ─────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Segmented speed model — short trips are slower (city roads), long trips use more highway (audit #22)
function haversineToDriveMinutes(km) {
  const speed = km < 30 ? 45 : km < 100 ? 65 : 80;
  return Math.round(km / speed * 60 + 10);
}

function applyHaversineEstimates() {
  if (!state.origin) return;
  RESORTS.forEach(resort => {
    if (state.driveCache[resort.id] !== undefined && !state.driveCache[resort.id]?.estimated) return;
    const km = haversineKm(state.origin.lat, state.origin.lon, resort.lat, resort.lon);
    state.driveCache[resort.id] = { mins: haversineToDriveMinutes(km), estimated: true, km };
  });
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
// Wrap all network calls with a timeout + AbortController (audit #24)
async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Weather cache persistence (audit #13) ───────────────────────────────────
const WX_TTL = 30 * 60 * 1000; // 30 minutes

function loadWeatherCache() {
  try {
    const raw = sessionStorage.getItem('ski-wx-cache');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const now = Date.now();
    Object.entries(parsed).forEach(([id, entry]) => {
      if (now - entry.ts < WX_TTL) state.weatherCache[id] = entry;
    });
  } catch (e) { /* corrupt cache — ignore */ }
}
function saveWeatherCache() {
  try { sessionStorage.setItem('ski-wx-cache', JSON.stringify(state.weatherCache)); }
  catch (e) { /* quota exceeded — silent */ }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function crowdForecast(resort) {
  let score = 20;
  if (resort.price < 70)                                    score += 15;
  if (resort.night)                                         score += 8;
  if (resort.terrainPark)                                   score += 6;
  if (resort.vertical > 1400)                               score += 10;
  if (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon') score += 15;
  if (resort.passGroup === 'Indy')                          score += 8;
  const drive = getDriveMins(resort.id);
  if (drive !== null) {                                    // audit #17 — removed redundant !== undefined
    if (drive < 90)       score += 22;
    else if (drive < 150) score += 14;
    else if (drive < 210) score += 7;
  }
  const label = score < 35 ? 'Low' : score < 60 ? 'Moderate' : 'High';
  return { score, label };
}

// Accept pre-computed normalized weights to avoid repeated computation (audit #5, #6)
function plannerScoreBreakdown(resort, weather, forecastIndex = null, w = null) {
  if (!w) w = normalizedWeights();
  const forecast  = weather?.forecast || [];
  const picks     = forecastIndex === null ? forecast : (forecast[forecastIndex] ? [forecast[forecastIndex]] : []);
  const snowTotal = picks.reduce((sum, f) => sum + (f.snow || 0), 0);
  const drive     = getDriveMins(resort.id);
  const crowd     = crowdForecast(resort);

  const normalized = {
    snow:         Math.min(1, snowTotal / SCORING.SNOW_SCALE),
    drive:        drive !== null ? Math.max(0, 1 - drive / SCORING.DRIVE_SCALE) : SCORING.DRIVE_DEFAULT,
    snowmaking:   Math.min(1, resort.snowmaking / SCORING.SNOWMAKING_MAX),
    vertical:     Math.min(1, resort.vertical    / SCORING.VERTICAL_MAX),
    price:        Math.max(0, Math.min(1, (SCORING.PRICE_MAX - resort.price) / (SCORING.PRICE_MAX - SCORING.PRICE_MIN))),
    crowdPenalty: Math.min(1, crowd.score / SCORING.CROWD_SCALE),
  };

  const components = {
    snow:         normalized.snow         * w.snow         * 100,
    drive:        normalized.drive        * w.drive        * 100,
    snowmaking:   normalized.snowmaking   * w.snowmaking   * 100,
    vertical:     normalized.vertical     * w.vertical     * 100,
    price:        normalized.price        * w.price        * 100,
    crowdPenalty: normalized.crowdPenalty * w.crowd        * 100,
  };

  let score = components.snow + components.drive + components.snowmaking +
              components.vertical + components.price - components.crowdPenalty;
  if (state.preset === 'indy' && resort.passGroup === 'Indy') score += 8;
  if (state.nightOnly && resort.night) score += 4;

  return { score: Math.round(score * 10) / 10, snowTotal, drive, resortId: resort.id, crowdLabel: crowd.label, components };
}

function hiddenGemScore(resort) {
  const crowd = crowdForecast(resort).score;
  let score = 0;
  score += Math.max(0, 100 - crowd);
  score += Math.max(0, 120 - resort.price);
  score += Math.min(60, resort.vertical / 25);
  score += resort.avgSnowfall / 4;
  if (resort.passGroup === 'Independent' || resort.passGroup === 'Indy') score += 15;
  return Math.round(score);
}

// ─── Filters ──────────────────────────────────────────────────────────────────
function activeFilters() {
  const filters = [];
  if (state.search.trim())     filters.push(`Search: "${esc(state.search.trim())}"`);
  if (state.maxDrive > 0)      filters.push(`Max drive: ${formatDriveMins(state.maxDrive)}${state.origin ? '' : ' (set location to activate)'}`);
  if (state.passFilter !== 'All')  filters.push(`Pass: ${esc(state.passFilter)}`);
  if (state.stateFilter !== 'All') filters.push(`State: ${esc(state.stateFilter)}`);
  if (state.nightOnly)         filters.push('Night only');
  return filters;
}

function renderActiveFilters() {
  els.activeFilters.innerHTML = activeFilters().map(f => `<span class="filter-pill">${f}</span>`).join('');
}

function filteredResorts() {
  const q = state.search.trim().toLowerCase();
  return RESORTS.filter(r => {
    if (q && !`${r.name} ${r.state} ${r.passGroup} ${r.region}`.toLowerCase().includes(q)) return false;
    if (state.passFilter !== 'All'  && r.passGroup !== state.passFilter)  return false;
    if (state.stateFilter !== 'All' && r.state     !== state.stateFilter) return false;
    if (state.nightOnly && !r.night) return false;
    if (state.maxDrive > 0 && state.origin) {
      const mins = getDriveMins(r.id);
      if (mins !== null && mins > state.maxDrive) return false;
    }
    return true;
  });
}

function staticSort(resorts) {
  const sorted = [...resorts];
  sorted.sort((a, b) => {
    switch (state.sortBy) {
      // Pre-extract drive mins to avoid double lookup per comparison (audit #12)
      case 'drive': {
        const da = getDriveMins(a.id) ?? 9999, db = getDriveMins(b.id) ?? 9999;
        return da - db;
      }
      case 'price':       return a.price      - b.price;
      case 'vertical':    return b.vertical   - a.vertical;
      case 'snowmaking':  return b.snowmaking  - a.snowmaking;
      case 'avgSnowfall': return b.avgSnowfall - a.avgSnowfall;
      default:            return a.name.localeCompare(b.name);
    }
  });
  return sorted;
}

// ─── Weather fetching ─────────────────────────────────────────────────────────
async function fetchWeather(resort) {
  const cached = state.weatherCache[resort.id];
  if (cached && Date.now() - cached.ts < WX_TTL) return cached.data;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}` +
      `&current=temperature_2m,weathercode,windspeed_10m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=4&timezone=America%2FNew_York`;
    const res  = await fetchWithTimeout(url);
    const data = await res.json();
    const wx = {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weathercode,
      wind: Math.round(data.current.windspeed_10m),
      forecast: data.daily.time.slice(1, 4).map((date, i) => ({
        day:  new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        code: data.daily.weathercode[i + 1],
        hi:   Math.round(data.daily.temperature_2m_max[i + 1]),
        lo:   Math.round(data.daily.temperature_2m_min[i + 1]),
        snow: Math.round((data.daily.snowfall_sum?.[i + 1] || 0) * 10) / 10,
      })),
    };
    state.weatherCache[resort.id] = { ts: Date.now(), data: wx };
    return wx;
  } catch (e) { return null; }
}

async function ensureWeather(resorts) {
  const queue = [...resorts];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (r) await fetchWeather(r);
    }
  }));
  saveWeatherCache();  // persist after each batch (audit #13)
}

// ─── OSRM drive times ─────────────────────────────────────────────────────────
const OSRM_LIMIT       = 40;
const OSRM_CONCURRENCY = 8;

async function fetchOsrmTime(resort) {
  if (!state.origin) return null;
  const existing = state.driveCache[resort.id];
  if (existing !== undefined && existing !== null && !existing?.estimated) return existing;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${state.origin.lon},${state.origin.lat};${resort.lon},${resort.lat}?overview=false`;
    const res  = await fetchWithTimeout(url);
    const data = await res.json();
    if (!data.routes?.[0]) throw new Error('No route');
    const mins = Math.round(data.routes[0].duration / 60);
    state.driveCache[resort.id] = mins;
    return mins;
  } catch (e) {
    return state.driveCache[resort.id]?.mins ?? null;
  }
}

async function loadDriveTimes() {
  if (!state.origin) return;
  applyHaversineEstimates();
  render();
  showToast('Refining drive times with routing data…', 5000);

  const closest = [...RESORTS]
    .filter(r => state.driveCache[r.id]?.km !== undefined)
    .sort((a, b) => state.driveCache[a.id].km - state.driveCache[b.id].km)
    .slice(0, OSRM_LIMIT);

  const queue = [...closest];
  let fetchCount = 0;
  await Promise.all(Array.from({ length: OSRM_CONCURRENCY }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (!r) break;
      await fetchOsrmTime(r);
      if (++fetchCount % 8 === 0) render();
    }
  }));
  render();
  showToast('Drive times ready', 1800);
}

async function geocodeOrigin(query) {
  const q = query.trim();
  if (!q) return null;
  if (/^\d{5}$/.test(q)) {
    try {
      const res = await fetchWithTimeout(`https://api.zippopotam.us/us/${q}`);
      if (res.ok) {
        const d     = await res.json();
        const place = d.places?.[0];
        if (place) return {
          lat:   parseFloat(place.latitude),
          lon:   parseFloat(place.longitude),
          label: `${place['place name']}, ${place.state || place['state abbreviation'] || ''}`.replace(/,\s*$/, ''),
        };
      }
    } catch (e) { console.warn('Zippopotam lookup failed, falling back to Nominatim:', e); } // audit #25
  }
  try {
    const res  = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name.split(',')[0] };
  } catch (e) { return null; }
}

// ─── Planner candidates ───────────────────────────────────────────────────────
function plannerCandidates(resorts) {
  const MAX = 80;
  const qualityScore = r => (r.avgSnowfall / 300) * 40 + (r.vertical / 3500) * 35 + (r.snowmaking / SCORING.SNOWMAKING_MAX) * 25;

  if (state.origin) {
    const byDistance = [...resorts]
      .filter(r => getDriveMins(r.id) !== null)
      .sort((a, b) => (getDriveMins(a.id) ?? 9999) - (getDriveMins(b.id) ?? 9999));
    const closestIds = new Set(byDistance.slice(0, 40).map(r => r.id));
    const extras = [...resorts]
      .filter(r => !closestIds.has(r.id))
      .sort((a, b) => qualityScore(b) - qualityScore(a))
      .slice(0, MAX - Math.min(40, byDistance.length));
    return [...byDistance.slice(0, 40), ...extras];
  }
  return [...resorts].sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, MAX);
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function summaryHtml(label, value, sub = '') {
  return `<div class="summary-card">` +
    `<div class="summary-label">${esc(label)}</div>` +
    `<div class="summary-value">${value}</div>` +
    (sub ? `<div class="summary-sub">${sub}</div>` : '') +
    `</div>`;
}

function renderSummaryCards(resorts) {
  const count      = resorts.length;
  const avgVertical = count ? Math.round(resorts.reduce((s, r) => s + r.vertical, 0) / count) : 0;
  const avgPrice    = count ? Math.round(resorts.reduce((s, r) => s + r.price, 0) / count) : 0;

  // Pre-extract drive mins once to avoid double lookup per sort comparison (audit #12)
  const withDrive  = resorts.map(r => ({ r, m: getDriveMins(r.id) })).filter(x => x.m !== null);
  withDrive.sort((a, b) => a.m - b.m);
  const closest    = withDrive[0];

  els.summaryCards.innerHTML = [
    summaryHtml('Mountains',   count),
    summaryHtml('Avg Vertical', `${avgVertical} ft`),
    summaryHtml('Avg Ticket*',  `$${avgPrice}`, 'directional estimate'),
    summaryHtml('Epic',  resorts.filter(r => r.passGroup === 'Epic').length),
    summaryHtml('Ikon',  resorts.filter(r => r.passGroup === 'Ikon').length),
    summaryHtml('Closest', closest ? esc(closest.r.name) : 'Set location', closest ? formatDrive(closest.r.id) : ''),
  ].join('');
}

// ─── Card templates ───────────────────────────────────────────────────────────
function cardBreakdown(b) {
  const c = b.components;
  return `<div class="breakdown">
    <div>Snow forecast: <strong>+${c.snow.toFixed(1)}</strong></div>
    <div>Drive time: <strong>+${c.drive.toFixed(1)}</strong></div>
    <div>Snowmaking: <strong>+${c.snowmaking.toFixed(1)}</strong></div>
    <div>Vertical: <strong>+${c.vertical.toFixed(1)}</strong></div>
    <div>Price / value: <strong>+${c.price.toFixed(1)}</strong></div>
    <div>Crowd penalty: <strong>-${c.crowdPenalty.toFixed(1)}</strong></div>
  </div>`;
}
function crowdClass(label) { return `crowd-${label.toLowerCase()}`; }

// ─── Async render panels ──────────────────────────────────────────────────────
// Single shared pipeline — compute candidates & weather once, pass to all panels (audit #2)
async function renderAsyncPanels(resorts) {
  const candidates = plannerCandidates(resorts);
  await ensureWeather(candidates);

  // Render everything that only needs forecast weather
  renderCompareTable(resorts);
  updateMap(resorts);
  renderDetail();
  renderVerdict(candidates);       // first pass — history chips may be missing
  _renderTomorrow(resorts, candidates);
  _renderWeekend(resorts, candidates);
  _renderStorm(resorts, candidates);
  _renderIndy(resorts, candidates);

  // Fetch last-7-days historical data in parallel — re-render verdict + detail when ready
  ensureHistory(candidates.slice(0, 50)).then(() => {
    renderVerdict(candidates);     // re-render with histTotal chips now populated
    renderDetail();                // re-render detail card with sparkline
    renderCompareTable(resorts);   // re-render to populate 7-Day column
  });
}

function _renderTomorrow(resorts, candidates) {   // audit #3 — no side-effects
  const w = normalizedWeights();
  const enriched = candidates.map(resort => {
    const wx = state.weatherCache[resort.id]?.data;
    return { resort, breakdown: plannerScoreBreakdown(resort, wx, 0, w) };
  }).sort((a, b) => b.breakdown.score - a.breakdown.score).slice(0, 3);

  els.tomorrowGrid.innerHTML = enriched.map((item, i) => `
    <div class="planner-card ${i === 0 ? 'top' : ''}">
      <div class="planner-title">${esc(item.resort.name)}</div>
      <div class="planner-meta">${esc(item.resort.state)} · ${esc(item.resort.passGroup)} · Planner score ${item.breakdown.score}</div>
      <div class="metric-chip">${item.breakdown.drive !== null ? formatDrive(item.breakdown.resortId) : 'Set location'}</div>
      <div class="metric-chip">❄️ ${item.breakdown.snowTotal.toFixed(1)}" tomorrow</div>
      <div class="metric-chip">Crowd: <span class="${crowdClass(item.breakdown.crowdLabel)}">${item.breakdown.crowdLabel}</span></div>
      ${cardBreakdown(item.breakdown)}
    </div>`).join('');
}

function _renderWeekend(resorts, candidates) {
  const w = normalizedWeights();
  const enriched = candidates.map(resort => {
    const wx = state.weatherCache[resort.id]?.data;
    return { resort, d1: plannerScoreBreakdown(resort, wx, 0, w), d2: plannerScoreBreakdown(resort, wx, 1, w) };
  });

  const day1 = [...enriched].sort((a, b) => b.d1.score - a.d1.score)[0];
  // Exclude day 1 winner from day 2 to guarantee variety (audit #36)
  const day2 = [...enriched]
    .filter(x => x.resort.id !== day1?.resort.id)
    .sort((a, b) => b.d2.score - a.d2.score)[0];

  const cards = [];
  if (day1) cards.push(`
    <div class="planner-card top">
      <div class="planner-title">Day 1: ${esc(day1.resort.name)}</div>
      <div class="planner-meta">Planner score ${day1.d1.score}</div>
      <div class="metric-chip">❄️ ${day1.d1.snowTotal.toFixed(1)}"</div>
      <div class="metric-chip">${day1.d1.drive !== null ? formatDrive(day1.d1.resortId) : 'Set location'}</div>
      ${cardBreakdown(day1.d1)}
    </div>`);
  if (day2) cards.push(`
    <div class="planner-card top">
      <div class="planner-title">Day 2: ${esc(day2.resort.name)}</div>
      <div class="planner-meta">Planner score ${day2.d2.score}</div>
      <div class="metric-chip">❄️ ${day2.d2.snowTotal.toFixed(1)}"</div>
      <div class="metric-chip">${day2.d2.drive !== null ? formatDrive(day2.d2.resortId) : 'Set location'}</div>
      ${cardBreakdown(day2.d2)}
    </div>`);
  els.weekendGrid.innerHTML = cards.join('');
}

function _renderStorm(resorts, candidates) {
  const enriched = candidates.map(resort => {
    const wx    = state.weatherCache[resort.id]?.data;
    const storm = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
    return { resort, storm };
  }).sort((a, b) => b.storm - a.storm).slice(0, 3);

  els.stormGrid.innerHTML = enriched.map(item => `
    <div class="planner-card">
      <div class="planner-title">${esc(item.resort.name)}</div>
      <div class="planner-meta">${esc(item.resort.state)} · Storm total ${item.storm.toFixed(1)}" next 3 days</div>
      <div class="metric-chip">${formatDrive(item.resort.id)}</div>
      <div class="metric-chip">Snowmaking: ${snowmakingDisplay(item.resort.snowmaking)}</div>
      <div class="metric-chip">${esc(item.resort.passGroup)}</div>
    </div>`).join('');
}

function _renderIndy(resorts, candidates) {
  const w = normalizedWeights();
  const indyCandidates = candidates.filter(r => r.passGroup === 'Indy');
  if (!indyCandidates.length) {
    els.indyGrid.innerHTML = '<div class="planner-card">No Indy mountains match the current filters.</div>';
    return;
  }
  const enriched = indyCandidates.map(resort => {
    const wx         = state.weatherCache[resort.id]?.data;
    const breakdown  = plannerScoreBreakdown(resort, wx, 0, w);
    const twoDayValue = resort.price * 2;
    return { resort, breakdown, twoDayValue };
  }).sort((a, b) =>
    (b.breakdown.score + b.twoDayValue / 25) - (a.breakdown.score + a.twoDayValue / 25)
  ).slice(0, 3);

  els.indyGrid.innerHTML = enriched.map(item => `
    <div class="planner-card">
      <div class="planner-title">${esc(item.resort.name)}</div>
      <div class="planner-meta">Estimated 2-day value $${item.twoDayValue} · Planner score ${item.breakdown.score}</div>
      <div class="metric-chip">${item.breakdown.drive !== null ? formatDrive(item.breakdown.resortId) : 'Set location'}</div>
      <div class="metric-chip">❄️ ${item.breakdown.snowTotal.toFixed(1)}"</div>
      ${cardBreakdown(item.breakdown)}
    </div>`).join('');
}

// ─── Sync render functions ────────────────────────────────────────────────────
function renderHiddenGems(resorts) {
  // Schwartzian transform — compute gem score once per resort, not O(N log N) in sort (audit #11)
  const withScore = resorts.map(r => ({ r, score: hiddenGemScore(r) }));
  withScore.sort((a, b) => b.score - a.score);
  const top = withScore.slice(0, 3);

  els.hiddenGemGrid.innerHTML = top.map(({ r, score }) => `
    <div class="planner-card">
      <div class="planner-title">${esc(r.name)}</div>
      <div class="planner-meta">${esc(r.state)} · Hidden Gem Score ${score}</div>
      <div class="metric-chip">${esc(r.passGroup)}</div>
      <div class="metric-chip">Avg snowfall ${r.avgSnowfall}"</div>
      <div class="metric-chip">Ticket* $${r.price}</div>
      <div class="breakdown">
        <div>Why it rates well: <strong>${crowdForecast(r).label}</strong> crowds,
        <strong>${r.vertical} ft</strong> vertical, and better-than-average value.</div>
      </div>
    </div>`).join('');
}

// Takes the already-sorted list from renderCompareTable (audit #21)
function renderPassCalc(sortedResorts) {
  const top = sortedResorts.slice(0, 6);
  els.passCalcGrid.innerHTML = top.map(resort => {
    const total = resort.price * state.skiDays;
    let verdict = 'Day tickets likely best';
    const passPrice = PASS_PRICES[resort.passGroup];
    if (passPrice) {
      const breakeven = Math.ceil(passPrice / resort.price);
      verdict = state.skiDays >= breakeven
        ? `${resort.passGroup} pass likely saves ~$${Math.max(0, total - passPrice)}`
        : `${Math.max(0, breakeven - state.skiDays)} more day(s) to break even on ${resort.passGroup}`;
    }
    return `<div class="planner-card">
      <div class="planner-title">${esc(resort.name)}</div>
      <div class="planner-meta">${esc(resort.passGroup)} · Ticket* $${resort.price}</div>
      <div class="breakdown">
        <div>${state.skiDays} ski days: <strong>$${total}</strong></div>
        <div>Recommendation: <strong>${verdict}</strong></div>
      </div>
    </div>`;
  }).join('');
}

// ─── Compare table ────────────────────────────────────────────────────────────
function renderCompareTable(resorts) {
  els.resultCount.textContent = `${resorts.length} mountains`;

  // Schwartzian transform — compute breakdown once per resort, not in sort comparator (audit #6)
  const w = normalizedWeights();
  const decorated = resorts.map(resort => {
    const weather    = state.weatherCache[resort.id]?.data;
    const breakdown  = weather ? plannerScoreBreakdown(resort, weather, 0, w) : null;
    const stormTotal = weather ? (weather.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    const hist       = historyCache.get(resort.id);
    return { resort, weather, breakdown, stormTotal, hist };
  });

  if (state.sortBy === 'planner') {
    decorated.sort((a, b) => (b.breakdown?.score ?? -Infinity) - (a.breakdown?.score ?? -Infinity));
  } else if (state.sortBy === 'storm') {
    decorated.sort((a, b) => (b.stormTotal ?? -1) - (a.stormTotal ?? -1));
  } else {
    const order = new Map(staticSort(resorts).map((r, i) => [r.id, i]));
    decorated.sort((a, b) => (order.get(a.resort.id) ?? 9999) - (order.get(b.resort.id) ?? 9999));
  }

  els.comparisonBody.innerHTML = decorated.map(({ resort, breakdown, stormTotal, hist }) => {
    const planner  = breakdown ? breakdown.score : '—';
    const storm    = stormTotal !== null ? `${stormTotal.toFixed(1)}"` : '…';
    const histCell = hist !== null && hist !== undefined ? `${hist.total}"` : '…';
    const crowd    = crowdForecast(resort).label;
    return `
      <tr class="${resort.id === state.selectedId ? 'active-row' : ''}" data-id="${resort.id}">
        <td><input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} /></td>
        <td><div class="row-name">${esc(resort.name)}</div></td>
        <td>${esc(resort.state)}</td>
        <td>${esc(resort.passGroup)}</td>
        <td>${planner}</td>
        <td>${storm}</td>
        <td class="hist-cell">${histCell}</td>
        <td>${formatDrive(resort.id)}</td>
        <td>${resort.vertical}</td>
        <td>${resort.trails}</td>
        <td>${snowmakingDisplay(resort.snowmaking)}</td>
        <td>$${resort.price}</td>
        <td class="${crowdClass(crowd)}">${crowd}</td>
      </tr>`;
  }).join('');

  // Pass sorted list to passCalc so it reflects current sort order (audit #21)
  renderPassCalc(decorated.map(d => d.resort));
  // Note: event listeners are wired once via delegation in wireEvents() — not attached here (audit #10)
}

function renderCompareTray() {
  if (!state.compareSet.size) {
    els.compareTray.classList.add('hidden');
    return;
  }
  els.compareTray.classList.remove('hidden');
  els.comparePills.innerHTML = [...state.compareSet].map(id => {
    const resort = RESORTS.find(r => r.id === id);
    return `<span class="compare-pill">${esc(resort?.name || id)}<button data-remove="${id}">✕</button></span>`;
  }).join('');
  // Listeners on pills are wired via delegation in wireEvents() (audit #10)
}

function renderComparePanel() {
  const resorts = [...state.compareSet].map(id => RESORTS.find(r => r.id === id)).filter(Boolean);
  if (resorts.length < 2) { showToast('Select at least 2 mountains to compare'); return; }
  els.comparePanel.classList.remove('hidden');
  const w    = normalizedWeights();
  const rows = [
    ['Pass',            r => esc(r.passGroup)],
    ['Vertical',        r => `${r.vertical} ft`],
    ['Trails',          r => r.trails],
    ['Snowmaking',      r => snowmakingDisplay(r.snowmaking)],
    ['Avg snowfall',    r => `${r.avgSnowfall}"`],
    ['Day ticket*',     r => `$${r.price}`],
    ['Drive',           r => formatDrive(r.id)],
    ['Tomorrow Planner', r => { const wx = state.weatherCache[r.id]?.data; return wx ? plannerScoreBreakdown(r, wx, 0, w).score : '—'; }],
    ['Crowd',           r => crowdForecast(r).label],
    ['Base / summit',   r => `${r.baseElevation} / ${r.summitElevation} ft`],
  ];
  els.compareContent.innerHTML = `
    <div class="table-wrap">
      <table class="comparison-table">
        <thead><tr><th scope="col">Metric</th>${resorts.map(r => `<th scope="col">${esc(r.name)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, fn]) =>
          `<tr><td><strong>${label}</strong></td>${resorts.map(r => `<td>${fn(r)}</td>`).join('')}</tr>`
        ).join('')}</tbody>
      </table>
    </div>`;
  els.comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail() {
  const resort = RESORTS.find(r => r.id === state.selectedId);
  if (!resort) { els.detailSection.classList.add('hidden'); return; }
  els.detailSection.classList.remove('hidden');
  const wx      = state.weatherCache[resort.id]?.data;
  const w       = normalizedWeights();
  const planner = wx ? plannerScoreBreakdown(resort, wx, 0, w) : null;
  const crowd   = crowdForecast(resort);
  const tb      = resort.terrainBreakdown;

  els.detailCard.innerHTML = `
    <div class="section-header">
      <div>
        <div class="eyebrow">Selected Mountain</div>
        <h2>${esc(resort.name)}</h2>
        <p class="muted small">${esc(resort.state)} · ${esc(resort.passGroup)} · ${esc(resort.ownerGroup)}</p>
      </div>
      <div class="metric-chip">${planner ? `Planner score ${planner.score}` : 'Loading planner score…'}</div>
    </div>
    <div class="metric-grid">
      <div class="metric-box"><div class="metric-label">Vertical</div><div class="metric-value">${resort.vertical} ft</div></div>
      <div class="metric-box"><div class="metric-label">Trails</div><div class="metric-value">${resort.trails}</div></div>
      <div class="metric-box"><div class="metric-label">Day Ticket*</div><div class="metric-value">$${resort.price}</div></div>
      <div class="metric-box"><div class="metric-label">Snowmaking</div><div class="metric-value detail-sm">${snowmakingDisplay(resort.snowmaking)}</div></div>
      <div class="metric-box"><div class="metric-label">Drive</div><div class="metric-value">${formatDrive(resort.id)}</div></div>
      <div class="metric-box"><div class="metric-label">Crowd</div><div class="metric-value detail-sm">${crowd.label}</div></div>
    </div>
    <div class="detail-grid" style="margin-top:16px">
      <div class="sub-card">
        <h3 style="margin:0 0 10px">Terrain Breakdown</h3>
        <div class="bar-row"><div>Beginner</div><div class="bar"><div class="bar-fill" style="width:${tb.beginner*100}%"></div></div><div>${Math.round(tb.beginner*100)}%</div></div>
        <div class="bar-row"><div>Intermediate</div><div class="bar"><div class="bar-fill" style="width:${tb.intermediate*100}%"></div></div><div>${Math.round(tb.intermediate*100)}%</div></div>
        <div class="bar-row"><div>Advanced</div><div class="bar"><div class="bar-fill" style="width:${tb.advanced*100}%"></div></div><div>${Math.round(tb.advanced*100)}%</div></div>
        <div class="breakdown">
          <div>Base / summit: <strong>${resort.baseElevation} / ${resort.summitElevation} ft</strong></div>
          <div>Avg snowfall: <strong>${resort.avgSnowfall}"</strong></div>
          <div>Night skiing: <strong>${resort.night ? 'Yes' : 'No'}</strong></div>
          <div>Terrain park: <strong>${resort.terrainPark ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>
      <div class="sub-card">
        <h3 style="margin:0 0 10px">Planner Explanation</h3>
        ${planner ? cardBreakdown(planner) : '<div class="muted">Weather is loading…</div>'}
      </div>
      <div class="sub-card">
        <h3 style="margin:0 0 10px">Snow History &amp; Forecast</h3>
        ${(() => {
          const hist = historyCache.get(resort.id);
          const spark = hist ? snowSparkline(hist.days) : null;
          const histRow = hist
            ? `<div class="history-row">
                <span class="history-label">Last 7 days</span>
                <span class="history-total">${hist.total}"</span>
                ${spark}
               </div>`
            : `<div class="muted small">Loading recent snowfall…</div>`;
          const fcRows = wx ? (wx.forecast || []).map(f =>
            `<div class="forecast-row">
               <span class="forecast-day">${f.day}</span>
               <span class="forecast-snow ${f.snow >= 4 ? 'snow-big' : f.snow >= 1 ? 'snow-med' : ''}">❄️ ${f.snow.toFixed(1)}"</span>
               <span class="forecast-temps">${f.lo}° – ${f.hi}°F</span>
             </div>`).join('')
            : '<div class="muted small">Weather loading…</div>';
          return histRow + (wx ? `<div class="forecast-rows" style="margin-top:10px">${fcRows}</div>` : '');
        })()}
      </div>
    </div>`;
  els.detailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Map ──────────────────────────────────────────────────────────────────────
let map = null, markers = {};

function passColor(g)  { return { Epic:'#2b6de9', Ikon:'#8a4dff', Indy:'#22b38a', Independent:'#90a4be' }[g] || '#90a4be'; }
function driveColor(m) { return m <= 90 ? '#22b38a' : m <= 150 ? '#8ccf57' : m <= 210 ? '#f0b44c' : '#e07a5f'; }
function stormColor(t) { return t >= 8 ? '#1d4ed8' : t >= 5 ? '#3b82f6' : t >= 2 ? '#93c5fd' : '#cbd5e1'; }

function renderMapLegend() {
  const html = state.mapMode === 'drive' ? `
    <span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> under 90 min</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#8ccf57"></i> 90–150 min</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#f0b44c"></i> 150–210 min</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#e07a5f"></i> 210+ min</span>`
    : state.mapMode === 'storm' ? `
    <span class="legend-chip"><i class="legend-dot" style="background:#1d4ed8"></i> 8&quot;+ forecast</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#3b82f6"></i> 5–8&quot;</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#93c5fd"></i> 2–5&quot;</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#cbd5e1"></i> under 2&quot;</span>`
    : `
    <span class="legend-chip"><i class="legend-dot" style="background:#2b6de9"></i> Epic</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#8a4dff"></i> Ikon</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> Indy</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#90a4be"></i> Independent</span>`;
  els.mapLegend.innerHTML = html;
}

function initMap() {
  if (map) return;
  map = L.map('leafletMap', { zoomControl: true, scrollWheelZoom: true }).setView([43.5, -72.2], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(map);
}

function updateMap(resorts) {
  initMap();
  renderMapLegend();
  const filtered = new Set(resorts.map(r => r.id));
  RESORTS.forEach(resort => {
    const inFilter = filtered.has(resort.id);
    const selected = resort.id === state.selectedId;
    const wx       = state.weatherCache[resort.id]?.data;
    const storm    = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
    const driveMins = getDriveMins(resort.id);  // extracted once (audit #12)
    let color = passColor(resort.passGroup);
    if (state.mapMode === 'drive' && driveMins !== null) color = driveColor(driveMins);
    if (state.mapMode === 'storm') color = stormColor(storm);
    const size = selected ? 16 : 10;
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,.18);opacity:${inFilter ? 1 : 0.22};box-shadow:${selected ? '0 0 0 4px rgba(43,109,233,.18)' : '0 2px 6px rgba(0,0,0,.18)'}"></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });
    if (markers[resort.id]) { markers[resort.id].setIcon(icon); return; }
    const marker = L.marker([resort.lat, resort.lon], { icon })
      .addTo(map)
      .bindPopup(`<strong>${esc(resort.name)}</strong><br>${esc(resort.state)} · ${esc(resort.passGroup)}<br>Vertical ${resort.vertical} ft<br>Ticket* $${resort.price}`);
    marker.on('click', () => { state.selectedId = resort.id; renderDetail(); });
    markers[resort.id] = marker;
  });
}

// ─── Top-level render ─────────────────────────────────────────────────────────
function renderAllCards(resorts) {
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderHiddenGems(resorts);
  renderCompareTable(resorts);   // also calls renderPassCalc with sorted list
  renderCompareTray();
  renderDetail();
  updateMap(resorts);
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));
  // Show loading state in async panels immediately
  if (els.verdictSection) els.verdictSection.classList.add('hidden'); // hide until weather loads
  els.tomorrowGrid.innerHTML = '<div class="planner-card">Loading tomorrow\'s picks…</div>';
  els.weekendGrid.innerHTML  = '<div class="planner-card">Loading weekend picks…</div>';
  els.stormGrid.innerHTML    = '<div class="planner-card">Loading storm outlook…</div>';
  els.indyGrid.innerHTML     = '<div class="planner-card">Loading Indy options…</div>';
  // Single async pipeline — fire and forget
  renderAsyncPanels(resorts);
}

function render() {
  renderAllCards(filteredResorts());
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
const debouncedRender = debounce(render, 150); // audit #7, #8

function wireEvents() {
  // Search — syncPlannerControls/renderActiveFilters immediately, defer full render
  els.searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    const q = e.target.value.trim().toLowerCase();
    const exactMatch = RESORTS.find(r => r.name.toLowerCase() === q);
    if (exactMatch) state.selectedId = exactMatch.id;
    renderActiveFilters();
    debouncedRender();
  });

  els.passFilter.addEventListener('change',     e => { state.passFilter  = e.target.value; pushUrlDebounced(); render(); });
  els.stateFilter.addEventListener('change',    e => { state.stateFilter = e.target.value; pushUrlDebounced(); render(); });
  els.maxDriveFilter.addEventListener('change', e => {
    state.maxDrive = Number(e.target.value);
    if (state.maxDrive > 0 && !state.origin) showToast('Set a starting location to use the Max Drive filter');
    pushUrlDebounced(); render();
  });
  els.sortBy.addEventListener('change', e => { state.sortBy = e.target.value; pushUrlDebounced(); render(); });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    pushUrlDebounced(); render();
  });
  els.resetFilters.addEventListener('click', () => {
    state.search = ''; state.passFilter = 'All'; state.stateFilter = 'All';
    state.sortBy = 'planner'; state.nightOnly = false; state.maxDrive = 0;
    els.searchInput.value    = '';
    els.passFilter.value     = 'All';
    els.stateFilter.value    = 'All';
    els.maxDriveFilter.value = '0';
    els.sortBy.value         = 'planner';
    els.toggleNight.setAttribute('aria-pressed', 'false');
    pushUrlDebounced(); render();
  });

  els.jumpTomorrow.addEventListener('click', () => $('tomorrowSection').scrollIntoView({ behavior: 'smooth' }));
  els.jumpWeekend.addEventListener('click',  () => $('weekendSection').scrollIntoView({ behavior: 'smooth' }));

  els.compareBtn.addEventListener('click', renderComparePanel);
  els.clearCompare.addEventListener('click', () => {
    state.compareSet.clear();
    els.comparePanel.classList.add('hidden');
    renderCompareTray();
    render();
  });
  els.closeCompare.addEventListener('click', () => els.comparePanel.classList.add('hidden'));

  // Weight sliders — sync UI instantly, debounce the expensive render (audit #7)
  [['snow','snowWeight'],['drive','driveWeight'],['snowmaking','snowmakingWeight'],
   ['vertical','verticalWeight'],['price','priceWeight'],['crowd','crowdWeight']].forEach(([key, id]) => {
    els[id].addEventListener('input', e => {
      state.weights[key] = Number(e.target.value);
      state.preset = 'custom';
      savePlannerState();
      syncPlannerControls();
      pushUrlDebounced();
      debouncedRender();
    });
  });
  presetBtns().forEach(btn => btn.addEventListener('click', () => { applyPreset(btn.dataset.preset); pushUrlDebounced(); }));

  mapModeBtns().forEach(btn => btn.addEventListener('click', () => {
    state.mapMode = btn.dataset.mapMode;
    const current = filteredResorts();  // reuse current filtered set
    updateMap(current);
    mapModeBtns().forEach(b => b.classList.toggle('active', b.dataset.mapMode === state.mapMode));
  }));

  els.skiDays.addEventListener('input', e => {
    state.skiDays = Math.max(1, Number(e.target.value || 5));
    savePlannerState();
    // Only re-render pass calc — no need for full render (audit #7)
    const decorated = [...filteredResorts()];   // same order as current table
    renderPassCalc(decorated);
  });

  // ── Event delegation for compare table and pills (audit #10) ──────────────
  els.comparisonBody.addEventListener('click', e => {
    const row = e.target.closest('tr[data-id]');
    if (!row || e.target.closest('input')) return;
    state.selectedId = row.dataset.id;
    renderDetail();
    // Highlight the row
    [...els.comparisonBody.querySelectorAll('tr')].forEach(r =>
      r.classList.toggle('active-row', r.dataset.id === state.selectedId));
  });
  els.comparisonBody.addEventListener('change', e => {
    const box = e.target.closest('input[data-compare]');
    if (!box) return;
    if (box.checked) state.compareSet.add(box.dataset.compare);
    else             state.compareSet.delete(box.dataset.compare);
    renderCompareTray();
  });
  els.comparePills.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    state.compareSet.delete(btn.dataset.remove);
    renderCompareTray();
    render();
  });

  // ── Location ────────────────────────────────────────────────────────────────
  const applyLocation = async () => {
    const q = els.originInput.value.trim();
    if (!q) {
      state.origin = null; state.driveCache = {};
      els.locationStatus.textContent = '';
      render(); return;
    }
    els.locationStatus.textContent = 'Finding location…';
    const loc = await geocodeOrigin(q);
    if (loc) {
      state.origin = loc; state.driveCache = {};
      els.locationStatus.textContent = `Location set to ${loc.label}`;
      pushUrlDebounced();
      await loadDriveTimes();
    } else {
      els.locationStatus.textContent = 'Location not found';
      showToast('Could not find that ZIP or location');
    }
  };
  els.setLocation.addEventListener('click', applyLocation);
  els.originInput.addEventListener('keydown', async e => { if (e.key === 'Enter') { e.preventDefault(); await applyLocation(); } });
  els.detectLocation.addEventListener('click', () => {
    if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
    els.locationStatus.textContent = 'Detecting your location…';
    navigator.geolocation.getCurrentPosition(async pos => {
      state.origin = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' };
      els.originInput.value = 'Your location';
      pushUrlDebounced();
      await loadDriveTimes();
      els.locationStatus.textContent = 'Using your location';
    }, () => { els.locationStatus.textContent = 'Could not get location'; });
  });

  // ── Back to top — rAF throttled (audit #9) ──────────────────────────────────
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        els.backToTop.classList.toggle('show', window.scrollY > 500);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  els.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  // Populate datalist with "Name, ST" so state is visible in suggestions (audit #28)
  els.resortSuggestions.innerHTML = RESORTS.map(r => `<option value="${esc(r.name)}, ${esc(r.state)}"></option>`).join('');
  els.passFilter.innerHTML  = UNIQUE_PASSES.map(v => `<option value="${v}">${v}</option>`).join('');
  els.stateFilter.innerHTML = UNIQUE_STATES.map(v => `<option value="${v}">${v}</option>`).join('');

  loadWeatherCache();    // restore session weather cache (audit #13)
  loadHistoryCache();    // restore session history cache

  // Apply URL state before syncing controls — URL wins over localStorage
  const hadUrlState = applyUrlState();
  if (hadUrlState && state.origin) {
    // Restore UI inputs to match URL-decoded state
    els.originInput.value    = state.origin.label;
    els.locationStatus.textContent = `Location set to ${state.origin.label}`;
  }
  if (hadUrlState) {
    els.passFilter.value     = state.passFilter;
    els.stateFilter.value    = state.stateFilter;
    els.sortBy.value         = state.sortBy;
    els.maxDriveFilter.value = String(state.maxDrive);
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
  }

  syncPlannerControls();
  wireEvents();
  render();

  // If origin was restored from URL, kick off drive time loading
  if (hadUrlState && state.origin) {
    applyHaversineEstimates();
    loadDriveTimes();
  }

  setTimeout(() => initMap(), 100);
}

initialize();
