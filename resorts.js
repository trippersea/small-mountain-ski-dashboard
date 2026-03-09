const RESORTS = [{"id":"mohawk-mountain","name":"Mohawk Mountain","state":"CT","region":"Connecticut","passGroup":"Indy","ownerGroup":"Indy + independent","lat":41.83549,"lon":-73.31095,"vertical":650,"trails":31,"lifts":3,"acres":146,"longestRun":1.5,"snowmaking":10000,"price":72,"night":true,"terrainPark":false,"baseElevation":950,"summitElevation":1600,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.3,"intermediate":0.5,"advanced":0.2},"rating":3.2,"ratingCount":38,"website":"https://www.mohawkmtn.com"},{"id":"mount-southington-ski-area","name":"Mount Southington","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.58206,"lon":-72.92492,"vertical":425,"trails":24,"lifts":5,"acres":53,"longestRun":0.3,"snowmaking":5100,"price":72,"night":true,"terrainPark":false,"baseElevation":100,"summitElevation":525,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.43,"intermediate":0.43,"advanced":0.14},"rating":3.1,"ratingCount":28,"website":"https://www.mountsouthington.com"},{"id":"powder-ridge-park","name":"Powder Ridge","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.50052,"lon":-72.74075,"vertical":550,"trails":28,"lifts":4,"acres":78,"longestRun":0.5,"snowmaking":6800,"price":76,"night":true,"terrainPark":false,"baseElevation":170,"summitElevation":720,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.42,"intermediate":0.37,"advanced":0.21},"rating":3.3,"ratingCount":1,"website":"https://www.powderridgepark.com"},{"id":"ski-sundown","name":"Ski Sundown","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.88469,"lon":-72.9467,"vertical":625,"trails":30,"lifts":2,"acres":115,"longestRun":1.0,"snowmaking":7000,"price":79,"night":true,"terrainPark":false,"baseElevation":450,"summitElevation":1075,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.5,"intermediate":0.25,"advanced":0.19},"rating":3.2,"ratingCount":31,"website":"https://www.skisundown.com"},{"id":"woodbury-ski-area","name":"Woodbury","state":"CT","region":"Connecticut","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5906,"lon":-73.25536,"vertical":300,"trails":21,"lifts":5,"acres":35,"longestRun":0.2,"snowmaking":5000,"price":67,"night":false,"terrainPark":false,"baseElevation":430,"summitElevation":730,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.25,"intermediate":0.25,"advanced":0.25},"rating":2.2,"ratingCount":15,"website":"https://www.woodburyskiarea.com"},{"id":"berkshire-east","name":"Berkshire East","state":"MA","region":"Massachusetts","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.62266,"lon":-72.87838,"vertical":1180,"trails":46,"lifts":5,"acres":315,"longestRun":2.0,"snowmaking":15000,"price":80,"night":true,"terrainPark":false,"baseElevation":540,"summitElevation":1720,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.37,"intermediate":0.44,"advanced":0.17},"rating":3.1,"ratingCount":26,"website":"https://www.berkshireeast.com"},{"id":"blandford-ski-area","name":"Blandford","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.19436,"lon":-72.91167,"vertical":465,"trails":25,"lifts":5,"acres":66,"longestRun":0.5,"snowmaking":8200,"price":72,"night":false,"terrainPark":false,"baseElevation":1035,"summitElevation":1685,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.4,"intermediate":0.5,"advanced":0.1},"rating":2.7,"ratingCount":9,"website":"https://www.blandfordski.com"},{"id":"blue-hills-ski-area","name":"Blue Hills","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.21536,"lon":-71.11928,"vertical":309,"trails":21,"lifts":4,"acres":31,"longestRun":0.0,"snowmaking":6000,"price":69,"night":true,"terrainPark":false,"baseElevation":326,"summitElevation":635,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.13,"intermediate":0.25,"advanced":0.62},"rating":3.1,"ratingCount":9,"website":"https://www.ski-bluehills.com"},{"id":"bousquet-ski-area","name":"Bousquet","state":"MA","region":"Massachusetts","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.41801,"lon":-73.2772,"vertical":750,"trails":33,"lifts":5,"acres":138,"longestRun":1.0,"snowmaking":9800,"price":70,"night":true,"terrainPark":false,"baseElevation":1125,"summitElevation":1875,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.34,"intermediate":0.33,"advanced":0.33},"rating":3.2,"ratingCount":9,"website":"https://www.bousquets.com"},{"id":"bradford-ski-area","name":"Bradford","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.74473,"lon":-71.05582,"vertical":248,"trails":19,"lifts":8,"acres":31,"longestRun":0.3,"snowmaking":4800,"price":71,"night":true,"terrainPark":false,"baseElevation":1300,"summitElevation":1548,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.1,"intermediate":0.8,"advanced":0.1},"rating":3.1,"ratingCount":7,"website":"https://www.bradfordskiarea.com"},{"id":"jiminy-peak","name":"Jiminy Peak","state":"MA","region":"Massachusetts","passGroup":"Ikon","ownerGroup":"Ikon network","lat":42.54425,"lon":-73.28622,"vertical":1150,"trails":45,"lifts":5,"acres":307,"longestRun":2.0,"snowmaking":16300,"price":128,"night":true,"terrainPark":true,"baseElevation":1230,"summitElevation":2380,"avgSnowfall":109,"terrainBreakdown":{"beginner":0.53,"intermediate":0.27,"advanced":0.13},"rating":3.5,"ratingCount":67,"website":"https://www.jiminypeak.com"},{"id":"nashoba-valley","name":"Nashoba Valley","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.54256,"lon":-71.44504,"vertical":240,"trails":19,"lifts":8,"acres":34,"longestRun":0.5,"snowmaking":5200,"price":72,"night":true,"terrainPark":false,"baseElevation":200,"summitElevation":440,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.24,"intermediate":0.47,"advanced":0.29},"rating":3.1,"ratingCount":17,"website":"https://www.skinashoba.com"},{"id":"otis-ridge-ski-area","name":"Otis Ridge","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.19638,"lon":-73.0984,"vertical":400,"trails":23,"lifts":4,"acres":73,"longestRun":1.0,"snowmaking":5500,"price":75,"night":false,"terrainPark":false,"baseElevation":1300,"summitElevation":1700,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":2.8,"ratingCount":5,"website":"https://www.otisridge.com"},{"id":"ski-butternut","name":"Ski Butternut","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.18366,"lon":-73.32015,"vertical":1000,"trails":41,"lifts":10,"acres":225,"longestRun":1.5,"snowmaking":11000,"price":86,"night":true,"terrainPark":false,"baseElevation":800,"summitElevation":1800,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.2},"rating":3.2,"ratingCount":50,"website":"https://www.skibutternut.com"},{"id":"ski-ward","name":"Ski Ward","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.30165,"lon":-71.68197,"vertical":210,"trails":18,"lifts":3,"acres":25,"longestRun":0.2,"snowmaking":4500,"price":68,"night":true,"terrainPark":false,"baseElevation":210,"summitElevation":420,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.5,"advanced":0.2},"rating":2.6,"ratingCount":3,"website":"https://www.skiward.com"},{"id":"wachusett-mountain-ski-area","name":"Wachusett","state":"MA","region":"Massachusetts","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.50298,"lon":-71.88631,"vertical":1000,"trails":41,"lifts":4,"acres":225,"longestRun":1.5,"snowmaking":10800,"price":86,"night":true,"terrainPark":true,"baseElevation":1006,"summitElevation":2006,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":66,"website":"https://www.wachusett.com"},{"id":"big-squaw-mountain-ski-resort","name":"Big Moose Mountain","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":45.50672,"lon":-69.70202,"vertical":660,"trails":31,"lifts":2,"acres":110,"longestRun":0.8,"snowmaking":50,"price":83,"night":false,"terrainPark":false,"baseElevation":1750,"summitElevation":3200,"avgSnowfall":230,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":3.2,"ratingCount":7,"website":"https://www.bigmoosemtn.com"},{"id":"black-mountain-of-maine","name":"Black Mountain of Maine","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.5342,"lon":-70.5368,"vertical":1380,"trails":50,"lifts":3,"acres":600,"longestRun":2.0,"snowmaking":75,"price":55,"night":true,"terrainPark":false,"baseElevation":1080,"summitElevation":2460,"avgSnowfall":110,"terrainBreakdown":{"beginner":0.24,"intermediate":0.38,"advanced":0.38},"rating":4.0,"ratingCount":120,"website":"https://www.skiblackmountain.com"},{"id":"camden-snow-bowl","name":"Camden Snow Bowl","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.21727,"lon":-69.13467,"vertical":850,"trails":36,"lifts":2,"acres":156,"longestRun":1.0,"snowmaking":4800,"price":76,"night":false,"terrainPark":false,"baseElevation":150,"summitElevation":1080,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.09,"intermediate":0.3,"advanced":0.61},"rating":3.1,"ratingCount":4,"website":"https://www.camdensnowbowl.com"},{"id":"lost-valley","name":"Lost Valley","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.13406,"lon":-70.28237,"vertical":240,"trails":19,"lifts":2,"acres":30,"longestRun":0.3,"snowmaking":4500,"price":64,"night":true,"terrainPark":false,"baseElevation":255,"summitElevation":495,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.47,"intermediate":0.2,"advanced":0.33},"rating":2.7,"ratingCount":4,"website":"https://www.lostvalleyski.com"},{"id":"mt-abram-ski-resort","name":"Mt. Abram","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.3798,"lon":-70.70686,"vertical":1150,"trails":45,"lifts":5,"acres":163,"longestRun":0.5,"snowmaking":17500,"price":76,"night":false,"terrainPark":false,"baseElevation":1050,"summitElevation":2250,"avgSnowfall":182,"terrainBreakdown":{"beginner":0.19,"intermediate":0.41,"advanced":0.26},"rating":3.2,"ratingCount":14,"website":"https://www.mtabram.com"},{"id":"mt-jefferson","name":"Mt. Jefferson","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":45.35399,"lon":-68.28303,"vertical":432,"trails":24,"lifts":3,"acres":54,"longestRun":0.3,"snowmaking":0,"price":73,"night":false,"terrainPark":true,"baseElevation":351,"summitElevation":753,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.0,"ratingCount":1,"website":"https://www.mtjeffersonski.com"},{"id":"new-hermon-mountain","name":"New Hermon","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.78079,"lon":-68.95727,"vertical":350,"trails":22,"lifts":3,"acres":90,"longestRun":1.9,"snowmaking":7000,"price":84,"night":false,"terrainPark":false,"baseElevation":100,"summitElevation":450,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.4,"intermediate":0.3,"advanced":0.3},"rating":2.6,"ratingCount":4,"website":"https://www.newhermonmountain.com"},{"id":"saddleback-inc","name":"Saddleback","state":"ME","region":"Maine","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.96506,"lon":-70.76822,"vertical":2000,"trails":69,"lifts":5,"acres":717,"longestRun":3.1,"snowmaking":12500,"price":100,"night":false,"terrainPark":false,"baseElevation":2460,"summitElevation":4120,"avgSnowfall":276,"terrainBreakdown":{"beginner":0.35,"intermediate":0.3,"advanced":0.25},"rating":3.1,"ratingCount":22,"website":"https://www.saddlebackmaine.com"},{"id":"shawnee-peak","name":"Shawnee Peak","state":"ME","region":"Maine","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.05899,"lon":-70.81554,"vertical":1350,"trails":51,"lifts":3,"acres":225,"longestRun":0.8,"snowmaking":23400,"price":90,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":1900,"avgSnowfall":170,"terrainBreakdown":{"beginner":0.25,"intermediate":0.45,"advanced":0.2},"rating":3.1,"ratingCount":20,"website":"https://www.shawneepeak.com"},{"id":"sugarloaf","name":"Sugarloaf","state":"ME","region":"Maine","passGroup":"Ikon","ownerGroup":"Ikon network","lat":45.03144,"lon":-70.31313,"vertical":2820,"trails":93,"lifts":10,"acres":1104,"longestRun":3.5,"snowmaking":61800,"price":157,"night":false,"terrainPark":false,"baseElevation":1417,"summitElevation":4237,"avgSnowfall":282,"terrainBreakdown":{"beginner":0.23,"intermediate":0.34,"advanced":0.28},"rating":3.2,"ratingCount":39,"website":"https://www.sugarloaf.com"},{"id":"sunday-river","name":"Sunday River","state":"ME","region":"Maine","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.46715,"lon":-70.84715,"vertical":2340,"trails":79,"lifts":7,"acres":819,"longestRun":3.0,"snowmaking":55200,"price":150,"night":false,"terrainPark":true,"baseElevation":825,"summitElevation":3150,"avgSnowfall":228,"terrainBreakdown":{"beginner":0.21,"intermediate":0.32,"advanced":0.23},"rating":3.3,"ratingCount":74,"website":"https://www.sundayriver.com"},{"id":"attitash","name":"Attitash","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":44.08278,"lon":-71.2294,"vertical":1750,"trails":62,"lifts":5,"acres":612,"longestRun":3.0,"snowmaking":24000,"price":151,"night":false,"terrainPark":false,"baseElevation":600,"summitElevation":2350,"avgSnowfall":168,"terrainBreakdown":{"beginner":0.26,"intermediate":0.46,"advanced":0.28},"rating":3.2,"ratingCount":36,"website":"https://www.attitash.com"},{"id":"black-mountain","name":"Black Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.16668,"lon":-71.16378,"vertical":1100,"trails":43,"lifts":4,"acres":257,"longestRun":1.6,"snowmaking":14000,"price":86,"night":false,"terrainPark":false,"baseElevation":1250,"summitElevation":2350,"avgSnowfall":168,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.08},"rating":3.1,"ratingCount":11,"website":"https://www.blackmt.com"},{"id":"bretton-woods","name":"Bretton Woods","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.25812,"lon":-71.44119,"vertical":1500,"trails":55,"lifts":5,"acres":400,"longestRun":2.0,"snowmaking":40000,"price":104,"night":false,"terrainPark":true,"baseElevation":1600,"summitElevation":3100,"avgSnowfall":205,"terrainBreakdown":{"beginner":0.25,"intermediate":0.29,"advanced":0.3},"rating":3.5,"ratingCount":64,"website":"https://www.brettonwoods.com"},{"id":"cannon-mountain","name":"Cannon Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.15645,"lon":-71.69842,"vertical":2180,"trails":74,"lifts":6,"acres":636,"longestRun":2.3,"snowmaking":19100,"price":102,"night":false,"terrainPark":false,"baseElevation":1900,"summitElevation":4080,"avgSnowfall":254,"terrainBreakdown":{"beginner":0.15,"intermediate":0.52,"advanced":0.33},"rating":3.3,"ratingCount":50,"website":"https://www.cannonmt.com"},{"id":"cranmore-mountain-resort","name":"Cranmore","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.05685,"lon":-71.09959,"vertical":1200,"trails":46,"lifts":4,"acres":220,"longestRun":1.0,"snowmaking":19200,"price":94,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":2000,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.28,"intermediate":0.44,"advanced":0.28},"rating":3.2,"ratingCount":20,"website":"https://www.cranmore.com"},{"id":"crotched-mountain","name":"Crotched","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":42.99842,"lon":-71.87369,"vertical":1016,"trails":41,"lifts":3,"acres":203,"longestRun":1.2,"snowmaking":10000,"price":133,"night":true,"terrainPark":true,"baseElevation":1050,"summitElevation":2066,"avgSnowfall":153,"terrainBreakdown":{"beginner":0.28,"intermediate":0.4,"advanced":0.32},"rating":3.2,"ratingCount":32,"website":"https://www.crotchedmountain.com"},{"id":"dartmouth-skiway","name":"Dartmouth Skiway","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.78775,"lon":-72.09954,"vertical":969,"trails":40,"lifts":4,"acres":186,"longestRun":1.1,"snowmaking":5400,"price":82,"night":false,"terrainPark":false,"baseElevation":974,"summitElevation":1943,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.21,"intermediate":0.5,"advanced":0.25},"rating":3.2,"ratingCount":5,"website":"https://www.dartmouthskiway.com"},{"id":"granite-gorge","name":"Granite Gorge","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.97098,"lon":-72.21204,"vertical":525,"trails":27,"lifts":4,"acres":74,"longestRun":0.5,"snowmaking":3900,"price":82,"night":false,"terrainPark":false,"baseElevation":800,"summitElevation":1325,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.35,"intermediate":0.35,"advanced":0.15},"rating":2.8,"ratingCount":4,"website":"https://www.granitegorge.com"},{"id":"gunstock","name":"Gunstock","state":"NH","region":"New Hampshire","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.53538,"lon":-71.37009,"vertical":1400,"trails":52,"lifts":4,"acres":315,"longestRun":1.5,"snowmaking":17600,"price":99,"night":true,"terrainPark":false,"baseElevation":900,"summitElevation":2300,"avgSnowfall":165,"terrainBreakdown":{"beginner":0.12,"intermediate":0.61,"advanced":0.0},"rating":3.2,"ratingCount":27,"website":"https://www.gunstock.com"},{"id":"king-pine","name":"King Pine","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.86808,"lon":-71.0889,"vertical":350,"trails":22,"lifts":3,"acres":44,"longestRun":0.3,"snowmaking":4500,"price":70,"night":true,"terrainPark":false,"baseElevation":500,"summitElevation":850,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.44,"intermediate":0.31,"advanced":0.1},"rating":2.8,"ratingCount":8,"website":"https://www.kingpine.com"},{"id":"loon-mountain","name":"Loon Mountain","state":"NH","region":"New Hampshire","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.03597,"lon":-71.62144,"vertical":2100,"trails":72,"lifts":7,"acres":648,"longestRun":2.5,"snowmaking":32200,"price":150,"night":false,"terrainPark":true,"baseElevation":950,"summitElevation":3050,"avgSnowfall":202,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.17},"rating":3.7,"ratingCount":70,"website":"https://www.loonmtn.com"},{"id":"mcintyre-ski-area","name":"McIntyre Ski Area","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.996,"lon":-71.488,"vertical":200,"trails":11,"lifts":5,"acres":20,"longestRun":0.5,"snowmaking":100,"price":45,"night":true,"terrainPark":true,"baseElevation":300,"summitElevation":500,"avgSnowfall":65,"terrainBreakdown":{"beginner":0.45,"intermediate":0.35,"advanced":0.2},"rating":3.4,"ratingCount":40,"website":"https://www.mcintyreskiarea.com"},{"id":"mount-sunapee","name":"Mount Sunapee","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":43.33189,"lon":-72.08014,"vertical":1510,"trails":55,"lifts":6,"acres":252,"longestRun":0.8,"snowmaking":21500,"price":135,"night":false,"terrainPark":false,"baseElevation":1233,"summitElevation":2743,"avgSnowfall":187,"terrainBreakdown":{"beginner":0.26,"intermediate":0.49,"advanced":0.25},"rating":3.1,"ratingCount":54,"website":"https://www.mountsunapee.com"},{"id":"pats-peak","name":"Pats Peak","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.15944,"lon":-71.79604,"vertical":770,"trails":34,"lifts":8,"acres":173,"longestRun":1.5,"snowmaking":11500,"price":82,"night":true,"terrainPark":false,"baseElevation":690,"summitElevation":1460,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.5,"intermediate":0.21,"advanced":0.11},"rating":3.2,"ratingCount":38,"website":"https://www.patspeak.com"},{"id":"ragged-mountain-resort","name":"Ragged Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.50323,"lon":-71.8427,"vertical":1250,"trails":48,"lifts":4,"acres":198,"longestRun":0.7,"snowmaking":20000,"price":82,"night":false,"terrainPark":false,"baseElevation":1000,"summitElevation":2250,"avgSnowfall":162,"terrainBreakdown":{"beginner":0.23,"intermediate":0.3,"advanced":0.39},"rating":3.1,"ratingCount":38,"website":"https://www.raggedmountainresort.com"},{"id":"tenney-mountain","name":"Tenney Mountain","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.769,"lon":-71.812,"vertical":1500,"trails":53,"lifts":4,"acres":110,"longestRun":2.0,"snowmaking":65,"price":79,"night":false,"terrainPark":true,"baseElevation":749,"summitElevation":2250,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.22,"intermediate":0.42,"advanced":0.36},"rating":3.8,"ratingCount":65,"website":"https://www.tenneymountain.com"},{"id":"waterville-valley","name":"Waterville Valley","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.95007,"lon":-71.49952,"vertical":2020,"trails":70,"lifts":7,"acres":707,"longestRun":3.0,"snowmaking":22000,"price":105,"night":true,"terrainPark":true,"baseElevation":1984,"summitElevation":4004,"avgSnowfall":250,"terrainBreakdown":{"beginner":0.15,"intermediate":0.6,"advanced":0.22},"rating":3.4,"ratingCount":37,"website":"https://www.waterville.com"},{"id":"whaleback-mountain","name":"Whaleback","state":"NH","region":"New Hampshire","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.6017,"lon":-72.18027,"vertical":700,"trails":32,"lifts":3,"acres":128,"longestRun":1.0,"snowmaking":6000,"price":79,"night":true,"terrainPark":false,"baseElevation":1100,"summitElevation":1800,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.23,"intermediate":0.41,"advanced":0.23},"rating":3.2,"ratingCount":7,"website":"https://www.whalebackmtn.com"},{"id":"wildcat-mountain","name":"Wildcat","state":"NH","region":"New Hampshire","passGroup":"Epic","ownerGroup":"Epic network","lat":44.25895,"lon":-71.20146,"vertical":2112,"trails":72,"lifts":1,"acres":704,"longestRun":2.8,"snowmaking":20000,"price":154,"night":false,"terrainPark":false,"baseElevation":1950,"summitElevation":4062,"avgSnowfall":253,"terrainBreakdown":{"beginner":0.21,"intermediate":0.46,"advanced":0.33},"rating":3.2,"ratingCount":25,"website":"https://www.skiwildcat.com"},{"id":"campgaw-mountain","name":"Campgaw","state":"NJ","region":"New Jersey","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.05426,"lon":-74.19931,"vertical":274,"trails":20,"lifts":5,"acres":34,"longestRun":0.3,"snowmaking":2300,"price":71,"night":true,"terrainPark":false,"baseElevation":450,"summitElevation":726,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.33,"intermediate":0.33,"advanced":0.25},"rating":3.1,"ratingCount":21,"website":"https://www.campgaw.com"},{"id":"mountain-creek-resort","name":"Mountain Creek","state":"NJ","region":"New Jersey","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.19075,"lon":-74.50512,"vertical":1040,"trails":42,"lifts":4,"acres":277,"longestRun":2.0,"snowmaking":16700,"price":88,"night":true,"terrainPark":true,"baseElevation":440,"summitElevation":1480,"avgSnowfall":70,"terrainBreakdown":{"beginner":0.17,"intermediate":0.63,"advanced":0.2},"rating":2.8,"ratingCount":128,"website":"https://www.mountaincreek.com"},{"id":"belleayre","name":"Belleayre","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.13224,"lon":-74.50531,"vertical":1404,"trails":52,"lifts":6,"acres":398,"longestRun":2.2,"snowmaking":16400,"price":103,"night":false,"terrainPark":false,"baseElevation":2025,"summitElevation":3429,"avgSnowfall":211,"terrainBreakdown":{"beginner":0.22,"intermediate":0.58,"advanced":0.1},"rating":3.3,"ratingCount":73,"website":"https://www.belleayre.com"},{"id":"brantling-ski-slopes","name":"Brantling","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.15012,"lon":-77.06574,"vertical":250,"trails":19,"lifts":5,"acres":27,"longestRun":0.1,"snowmaking":1600,"price":77,"night":true,"terrainPark":false,"baseElevation":600,"summitElevation":850,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":2.7,"ratingCount":14,"website":"https://www.brantling.com"},{"id":"bristol-mountain","name":"Bristol Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.7467,"lon":-77.40194,"vertical":1200,"trails":46,"lifts":3,"acres":320,"longestRun":2.0,"snowmaking":14800,"price":100,"night":false,"terrainPark":true,"baseElevation":1000,"summitElevation":2200,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.35,"intermediate":0.45,"advanced":0.2},"rating":3.3,"ratingCount":54,"website":"https://www.bristolmountain.com"},{"id":"buffalo-ski-club-ski-area","name":"Buffalo Ski Club","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.68098,"lon":-78.69204,"vertical":500,"trails":26,"lifts":6,"acres":50,"longestRun":0.0,"snowmaking":15000,"price":81,"night":false,"terrainPark":false,"baseElevation":2025,"summitElevation":3429,"avgSnowfall":211,"terrainBreakdown":{"beginner":0.2,"intermediate":0.46,"advanced":0.0},"rating":3.2,"ratingCount":3,"website":"https://www.buffaloskiclub.com"},{"id":"catamount-ski-ride-area","name":"Catamount","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.45921,"lon":-73.87237,"vertical":1000,"trails":41,"lifts":6,"acres":267,"longestRun":2.0,"snowmaking":13000,"price":88,"night":true,"terrainPark":false,"baseElevation":1000,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.44,"advanced":0.14},"rating":3.2,"ratingCount":53,"website":"https://www.catamountski.com"},{"id":"dry-hill-ski-area","name":"Dry Hill","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.93123,"lon":-75.90181,"vertical":300,"trails":21,"lifts":3,"acres":35,"longestRun":0.2,"snowmaking":2600,"price":68,"night":true,"terrainPark":false,"baseElevation":650,"summitElevation":950,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.7,"ratingCount":10,"website":"https://www.dryhillski.com"},{"id":"gore-mountain","name":"Gore Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.67328,"lon":-74.00684,"vertical":2537,"trails":84,"lifts":8,"acres":1205,"longestRun":4.5,"snowmaking":42500,"price":129,"night":false,"terrainPark":false,"baseElevation":998,"summitElevation":3600,"avgSnowfall":220,"terrainBreakdown":{"beginner":0.1,"intermediate":0.51,"advanced":0.34},"rating":3.3,"ratingCount":59,"website":"https://www.goremountain.com"},{"id":"greek-peak","name":"Greek Peak","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.51237,"lon":-76.14755,"vertical":952,"trails":39,"lifts":7,"acres":214,"longestRun":1.5,"snowmaking":18400,"price":84,"night":true,"terrainPark":false,"baseElevation":1148,"summitElevation":2100,"avgSnowfall":145,"terrainBreakdown":{"beginner":0.48,"intermediate":0.21,"advanced":0.24},"rating":3.1,"ratingCount":44,"website":"https://www.greekpeak.net"},{"id":"hickory-ski-center","name":"Hickory","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.47441,"lon":-73.81735,"vertical":1200,"trails":46,"lifts":3,"acres":220,"longestRun":1.0,"snowmaking":0,"price":93,"night":false,"terrainPark":false,"baseElevation":700,"summitElevation":1900,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.3,"advanced":0.4},"rating":3.1,"ratingCount":6,"website":"https://www.hickoryskiing.com"},{"id":"holimont-ski-area","name":"HoliMont","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.27316,"lon":-78.68944,"vertical":700,"trails":32,"lifts":5,"acres":158,"longestRun":1.5,"snowmaking":13500,"price":91,"night":false,"terrainPark":false,"baseElevation":1560,"summitElevation":2260,"avgSnowfall":153,"terrainBreakdown":{"beginner":0.26,"intermediate":0.28,"advanced":0.45},"rating":3.1,"ratingCount":10,"website":"https://www.holimont.com"},{"id":"holiday-mountain","name":"Holiday Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.62959,"lon":-74.61449,"vertical":400,"trails":23,"lifts":4,"acres":53,"longestRun":0.4,"snowmaking":3700,"price":80,"night":false,"terrainPark":false,"baseElevation":1150,"summitElevation":1550,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.27,"advanced":0.31},"rating":2.7,"ratingCount":7,"website":"https://www.holidaymtn.com"},{"id":"holiday-valley","name":"Holiday Valley","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.25845,"lon":-78.67385,"vertical":750,"trails":33,"lifts":10,"acres":138,"longestRun":1.0,"snowmaking":26600,"price":90,"night":true,"terrainPark":true,"baseElevation":1500,"summitElevation":2250,"avgSnowfall":152,"terrainBreakdown":{"beginner":0.34,"intermediate":0.28,"advanced":0.37},"rating":3.3,"ratingCount":53,"website":"https://www.holidayvalley.com"},{"id":"hunt-hollow-ski-club","name":"Hunt Hollow","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.6461,"lon":-77.47812,"vertical":825,"trails":36,"lifts":3,"acres":151,"longestRun":1.0,"snowmaking":40000,"price":91,"night":false,"terrainPark":false,"baseElevation":1000,"summitElevation":2030,"avgSnowfall":142,"terrainBreakdown":{"beginner":0.32,"intermediate":0.21,"advanced":0.37},"rating":3.4,"ratingCount":1,"website":"https://www.hunthollow.com"},{"id":"hunter-mountain","name":"Hunter Mountain","state":"NY","region":"New York","passGroup":"Epic","ownerGroup":"Epic network","lat":42.17787,"lon":-74.23042,"vertical":1600,"trails":58,"lifts":7,"acres":427,"longestRun":2.0,"snowmaking":24000,"price":143,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":3200,"avgSnowfall":200,"terrainBreakdown":{"beginner":0.28,"intermediate":0.24,"advanced":0.33},"rating":3.1,"ratingCount":89,"website":"https://www.huntermtn.com"},{"id":"kissing-bridge","name":"Kissing Bridge","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.60746,"lon":-78.65278,"vertical":550,"trails":28,"lifts":9,"acres":78,"longestRun":0.5,"snowmaking":55000,"price":84,"night":true,"terrainPark":false,"baseElevation":1150,"summitElevation":1700,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.2,"intermediate":0.5,"advanced":0.3},"rating":3.1,"ratingCount":18,"website":"https://www.kissing-bridge.com"},{"id":"labrador-mt","name":"Labrador Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.74179,"lon":-76.03021,"vertical":700,"trails":32,"lifts":3,"acres":128,"longestRun":1.0,"snowmaking":23700,"price":88,"night":false,"terrainPark":false,"baseElevation":1125,"summitElevation":1825,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":2.9,"ratingCount":14,"website":"https://www.labradormountain.com"},{"id":"maple-ski-ridge","name":"Maple Ski Ridge","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.81776,"lon":-74.03162,"vertical":450,"trails":25,"lifts":2,"acres":56,"longestRun":0.3,"snowmaking":2500,"price":69,"night":true,"terrainPark":false,"baseElevation":750,"summitElevation":1200,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.11,"intermediate":0.44,"advanced":0.44},"rating":2.4,"ratingCount":3,"website":"https://www.mapleskiarea.com"},{"id":"mccauley-mountain-ski-center","name":"McCauley Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.69719,"lon":-74.96616,"vertical":633,"trails":30,"lifts":5,"acres":79,"longestRun":0.3,"snowmaking":5500,"price":74,"night":false,"terrainPark":true,"baseElevation":1563,"summitElevation":2250,"avgSnowfall":152,"terrainBreakdown":{"beginner":0.26,"intermediate":0.43,"advanced":0.3},"rating":3.3,"ratingCount":13,"website":"https://www.mccauleyny.com"},{"id":"mount-peter-ski-area","name":"Mount Peter","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.2478,"lon":-74.29519,"vertical":450,"trails":25,"lifts":5,"acres":83,"longestRun":1.0,"snowmaking":6900,"price":86,"night":false,"terrainPark":false,"baseElevation":750,"summitElevation":1250,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.43,"intermediate":0.21,"advanced":0.21},"rating":3.2,"ratingCount":43,"website":"https://www.mtpeter.com"},{"id":"oak-mountain","name":"Oak Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.51812,"lon":-74.36221,"vertical":650,"trails":31,"lifts":3,"acres":130,"longestRun":1.2,"snowmaking":1800,"price":77,"night":false,"terrainPark":false,"baseElevation":1750,"summitElevation":2400,"avgSnowfall":160,"terrainBreakdown":{"beginner":0.45,"intermediate":0.27,"advanced":0.18},"rating":0.0,"ratingCount":0,"website":"https://www.oakmountainski.com"},{"id":"peekn-peak","name":"Peek\u2019n Peak","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.06204,"lon":-79.7356,"vertical":400,"trails":23,"lifts":2,"acres":120,"longestRun":2.4,"snowmaking":11000,"price":85,"night":true,"terrainPark":true,"baseElevation":1400,"summitElevation":1800,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.45,"advanced":0.15},"rating":3.3,"ratingCount":58,"website":"https://www.pknpk.com"},{"id":"plattekill-mountain","name":"Plattekill","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.10731,"lon":-74.08652,"vertical":1100,"trails":43,"lifts":3,"acres":293,"longestRun":2.0,"snowmaking":7500,"price":99,"night":false,"terrainPark":false,"baseElevation":2400,"summitElevation":3500,"avgSnowfall":215,"terrainBreakdown":{"beginner":0.2,"intermediate":0.4,"advanced":0.2},"rating":3.2,"ratingCount":25,"website":"https://www.plattekill.com"},{"id":"royal-mountain-ski-area","name":"Royal Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.0813,"lon":-74.50481,"vertical":550,"trails":28,"lifts":3,"acres":69,"longestRun":0.3,"snowmaking":2800,"price":83,"night":false,"terrainPark":false,"baseElevation":1250,"summitElevation":1800,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.34,"advanced":0.33},"rating":3.1,"ratingCount":7,"website":"https://www.royalmountain.com"},{"id":"snow-ridge","name":"Snow Ridge","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.02733,"lon":-74.10883,"vertical":650,"trails":31,"lifts":6,"acres":108,"longestRun":0.8,"snowmaking":6500,"price":75,"night":true,"terrainPark":false,"baseElevation":1350,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.14,"intermediate":0.33,"advanced":0.33},"rating":2.6,"ratingCount":7,"website":"https://www.snowridge.com"},{"id":"song-mountain","name":"Song Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.77422,"lon":-76.15877,"vertical":700,"trails":32,"lifts":4,"acres":93,"longestRun":0.4,"snowmaking":7000,"price":83,"night":true,"terrainPark":false,"baseElevation":1240,"summitElevation":1940,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.5,"intermediate":0.29,"advanced":0.13},"rating":2.6,"ratingCount":9,"website":"https://www.songmountain.com"},{"id":"swain","name":"Swain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":42.47784,"lon":-77.85333,"vertical":650,"trails":31,"lifts":5,"acres":119,"longestRun":1.0,"snowmaking":9000,"price":78,"night":false,"terrainPark":false,"baseElevation":1320,"summitElevation":1970,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.27,"intermediate":0.39,"advanced":0.33},"rating":3.1,"ratingCount":13,"website":"https://www.swain.com"},{"id":"thunder-ridge","name":"Thunder Ridge","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.50793,"lon":-73.58608,"vertical":500,"trails":26,"lifts":5,"acres":67,"longestRun":0.4,"snowmaking":10000,"price":83,"night":false,"terrainPark":false,"baseElevation":770,"summitElevation":1270,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.4,"intermediate":0.4,"advanced":0.2},"rating":3.1,"ratingCount":29,"website":"https://www.thunderridgeski.com"},{"id":"titus-mountain","name":"Titus Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.76575,"lon":-74.23398,"vertical":1200,"trails":46,"lifts":8,"acres":320,"longestRun":2.0,"snowmaking":15000,"price":90,"night":true,"terrainPark":false,"baseElevation":825,"summitElevation":2025,"avgSnowfall":141,"terrainBreakdown":{"beginner":0.34,"intermediate":0.38,"advanced":0.22},"rating":3.2,"ratingCount":15,"website":"https://www.titusmountain.com"},{"id":"toggenburg-mountain","name":"Toggenburg","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":42.82624,"lon":-75.95988,"vertical":700,"trails":32,"lifts":4,"acres":93,"longestRun":0.4,"snowmaking":0,"price":84,"night":false,"terrainPark":false,"baseElevation":1300,"summitElevation":2000,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.33,"intermediate":0.33,"advanced":0.34},"rating":2.9,"ratingCount":11,"website":"https://www.skitog.com"},{"id":"west-mountain","name":"West Mountain","state":"NY","region":"New York","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.69376,"lon":-74.12347,"vertical":1010,"trails":41,"lifts":4,"acres":151,"longestRun":0.6,"snowmaking":10500,"price":79,"night":true,"terrainPark":false,"baseElevation":460,"summitElevation":1470,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.55,"advanced":0.09},"rating":3.0,"ratingCount":27,"website":"https://www.westmtn.com"},{"id":"whiteface-mountain-resort","name":"Whiteface","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.29706,"lon":-74.01057,"vertical":3430,"trails":110,"lifts":7,"acres":943,"longestRun":2.1,"snowmaking":22000,"price":123,"night":false,"terrainPark":false,"baseElevation":1220,"summitElevation":4650,"avgSnowfall":272,"terrainBreakdown":{"beginner":0.2,"intermediate":0.42,"advanced":0.38},"rating":3.2,"ratingCount":68,"website":"https://www.whiteface.com"},{"id":"willard-mountain","name":"Willard Mountain","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.02066,"lon":-73.51588,"vertical":505,"trails":26,"lifts":5,"acres":67,"longestRun":0.4,"snowmaking":3500,"price":83,"night":false,"terrainPark":false,"baseElevation":910,"summitElevation":1415,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.1,"ratingCount":7,"website":"https://www.willardmountain.com"},{"id":"windham-mountain","name":"Windham Mountain","state":"NY","region":"New York","passGroup":"Ikon","ownerGroup":"Ikon network","lat":42.29373,"lon":-74.25671,"vertical":1600,"trails":58,"lifts":6,"acres":427,"longestRun":2.0,"snowmaking":28000,"price":140,"night":false,"terrainPark":true,"baseElevation":1500,"summitElevation":3100,"avgSnowfall":195,"terrainBreakdown":{"beginner":0.3,"intermediate":0.43,"advanced":0.16},"rating":3.3,"ratingCount":48,"website":"https://www.windhammountain.com"},{"id":"woods-valley-ski-area","name":"Woods Valley","state":"NY","region":"New York","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.30267,"lon":-75.38476,"vertical":500,"trails":26,"lifts":6,"acres":62,"longestRun":0.3,"snowmaking":1600,"price":81,"night":false,"terrainPark":false,"baseElevation":900,"summitElevation":1400,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.2,"intermediate":0.6,"advanced":0.2},"rating":2.9,"ratingCount":9,"website":"https://www.woodsvalleyskiarea.com"},{"id":"bear-creek-mountain-resort","name":"Bear Creek","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.47533,"lon":-75.6253,"vertical":510,"trails":27,"lifts":5,"acres":94,"longestRun":1.0,"snowmaking":8600,"price":83,"night":false,"terrainPark":true,"baseElevation":600,"summitElevation":1100,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":55,"website":"https://www.bcmountainresort.com"},{"id":"big-boulder","name":"Big Boulder","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.11,"lon":-75.65123,"vertical":600,"trails":29,"lifts":6,"acres":60,"longestRun":0.0,"snowmaking":5500,"price":117,"night":true,"terrainPark":false,"baseElevation":1700,"summitElevation":2175,"avgSnowfall":99,"terrainBreakdown":{"beginner":1.0,"intermediate":0.0,"advanced":0.0},"rating":3.1,"ratingCount":36,"website":"https://www.jackfrostbigboulder.com"},{"id":"blue-knob","name":"Blue Knob","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.28841,"lon":-78.56168,"vertical":1072,"trails":43,"lifts":3,"acres":286,"longestRun":2.0,"snowmaking":8400,"price":95,"night":false,"terrainPark":false,"baseElevation":2074,"summitElevation":3146,"avgSnowfall":147,"terrainBreakdown":{"beginner":0.15,"intermediate":0.41,"advanced":0.26},"rating":3.2,"ratingCount":42,"website":"https://www.blueknob.com"},{"id":"blue-mountain-ski-area","name":"Blue Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.82264,"lon":-75.51248,"vertical":1082,"trails":43,"lifts":13,"acres":216,"longestRun":1.2,"snowmaking":16400,"price":91,"night":true,"terrainPark":true,"baseElevation":460,"summitElevation":1600,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.41,"intermediate":0.13,"advanced":0.13},"rating":3.5,"ratingCount":154,"website":"https://www.skibluemountain.com"},{"id":"camelback-mountain-resort","name":"Camelback","state":"PA","region":"Pennsylvania","passGroup":"Ikon","ownerGroup":"Ikon network","lat":41.05149,"lon":-75.35518,"vertical":800,"trails":35,"lifts":11,"acres":147,"longestRun":1.0,"snowmaking":16000,"price":122,"night":true,"terrainPark":true,"baseElevation":1250,"summitElevation":2100,"avgSnowfall":95,"terrainBreakdown":{"beginner":0.32,"intermediate":0.32,"advanced":0.32},"rating":3.2,"ratingCount":126,"website":"https://www.camelbackresort.com"},{"id":"eagle-rock","name":"Eagle Rock","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.20268,"lon":-75.37779,"vertical":550,"trails":28,"lifts":3,"acres":101,"longestRun":1.0,"snowmaking":0,"price":83,"night":false,"terrainPark":false,"baseElevation":1260,"summitElevation":1810,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.5,"intermediate":0.07,"advanced":0.43},"rating":3.1,"ratingCount":12,"website":"https://www.eaglerockresort.com"},{"id":"elk-mountain-ski-resort","name":"Elk Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.72051,"lon":-75.5593,"vertical":1000,"trails":41,"lifts":7,"acres":158,"longestRun":0.7,"snowmaking":14600,"price":86,"night":false,"terrainPark":false,"baseElevation":1693,"summitElevation":2693,"avgSnowfall":125,"terrainBreakdown":{"beginner":0.22,"intermediate":0.37,"advanced":0.41},"rating":3.3,"ratingCount":96,"website":"https://www.elkskier.com"},{"id":"jack-frost","name":"Jack Frost","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.11,"lon":-75.65123,"vertical":600,"trails":29,"lifts":7,"acres":110,"longestRun":1.0,"snowmaking":10000,"price":124,"night":true,"terrainPark":false,"baseElevation":1400,"summitElevation":2000,"avgSnowfall":90,"terrainBreakdown":{"beginner":1.0,"intermediate":0.0,"advanced":0.0},"rating":3.2,"ratingCount":42,"website":"https://www.jackfrostbigboulder.com"},{"id":"liberty","name":"Liberty Mountain","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":41.55841,"lon":-77.10469,"vertical":620,"trails":30,"lifts":8,"acres":114,"longestRun":1.0,"snowmaking":10000,"price":124,"night":true,"terrainPark":false,"baseElevation":570,"summitElevation":1190,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.35,"intermediate":0.4,"advanced":0.0},"rating":3.1,"ratingCount":62,"website":"https://www.libertymountainresort.com"},{"id":"montage-mountain","name":"Montage Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.39871,"lon":-75.63755,"vertical":1000,"trails":41,"lifts":4,"acres":200,"longestRun":1.2,"snowmaking":14000,"price":90,"night":true,"terrainPark":true,"baseElevation":960,"summitElevation":1960,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.35,"intermediate":0.3,"advanced":0.2},"rating":3.4,"ratingCount":124,"website":"https://www.montagemountainresorts.com"},{"id":"mount-pleasant-of-edinboro","name":"Mount Pleasant of Edinboro","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.85099,"lon":-80.07029,"vertical":340,"trails":22,"lifts":1,"acres":48,"longestRun":0.5,"snowmaking":3500,"price":79,"night":false,"terrainPark":false,"baseElevation":1200,"summitElevation":1540,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.22,"intermediate":0.56,"advanced":0.22},"rating":3.3,"ratingCount":3,"website":"https://www.mtpleasantpa.com"},{"id":"roundtop-mountain-resort","name":"Roundtop","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":40.10945,"lon":-76.92755,"vertical":600,"trails":29,"lifts":6,"acres":80,"longestRun":0.4,"snowmaking":10300,"price":119,"night":false,"terrainPark":false,"baseElevation":800,"summitElevation":1400,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.2,"intermediate":0.25,"advanced":0.4},"rating":2.9,"ratingCount":39,"website":"https://www.roundtopmountainresort.com"},{"id":"seven-springs","name":"Seven Springs","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.02298,"lon":-79.29771,"vertical":750,"trails":33,"lifts":7,"acres":150,"longestRun":1.2,"snowmaking":28500,"price":86,"night":false,"terrainPark":true,"baseElevation":2240,"summitElevation":2994,"avgSnowfall":140,"terrainBreakdown":{"beginner":0.36,"intermediate":0.42,"advanced":0.18},"rating":3.1,"ratingCount":120,"website":"https://www.7springs.com"},{"id":"shawnee-mountain-ski-area","name":"Shawnee Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.03961,"lon":-75.08526,"vertical":700,"trails":32,"lifts":8,"acres":163,"longestRun":1.6,"snowmaking":12500,"price":88,"night":false,"terrainPark":false,"baseElevation":650,"summitElevation":1350,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.26,"intermediate":0.48,"advanced":0.26},"rating":3.2,"ratingCount":35,"website":"https://www.shawneemt.com"},{"id":"ski-big-bear","name":"Ski Big Bear","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.52398,"lon":-75.0233,"vertical":650,"trails":31,"lifts":6,"acres":146,"longestRun":1.5,"snowmaking":2600,"price":87,"night":false,"terrainPark":false,"baseElevation":600,"summitElevation":1250,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.33,"intermediate":0.28,"advanced":0.33},"rating":3.1,"ratingCount":28,"website":"https://www.skibigbear.com"},{"id":"big-bear","name":"Ski Big Bear at Masthope","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.52242,"lon":-75.02357,"vertical":500,"trails":26,"lifts":2,"acres":92,"longestRun":1.0,"snowmaking":50,"price":59,"night":true,"terrainPark":false,"baseElevation":500,"summitElevation":1200,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.28,"intermediate":0.42,"advanced":0.3},"rating":3.5,"ratingCount":0,"website":"https://www.skibigbear.com"},{"id":"ski-sawmill","name":"Ski Sawmill","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5186,"lon":-77.29075,"vertical":515,"trails":27,"lifts":4,"acres":56,"longestRun":0.1,"snowmaking":1300,"price":78,"night":false,"terrainPark":false,"baseElevation":1700,"summitElevation":2215,"avgSnowfall":101,"terrainBreakdown":{"beginner":0.35,"intermediate":0.25,"advanced":0.4},"rating":3.2,"ratingCount":14,"website":"https://www.skisawmill.com"},{"id":"sno-mountain","name":"Sno Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.35124,"lon":-75.66292,"vertical":500,"trails":26,"lifts":2,"acres":92,"longestRun":1.0,"snowmaking":50,"price":59,"night":false,"terrainPark":false,"baseElevation":500,"summitElevation":1200,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.28,"intermediate":0.42,"advanced":0.3},"rating":3.5,"ratingCount":0,"website":"https://www.snomountain.com"},{"id":"spring-mountain-ski-area","name":"Spring Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.27254,"lon":-75.45006,"vertical":450,"trails":25,"lifts":5,"acres":52,"longestRun":0.2,"snowmaking":4500,"price":77,"night":false,"terrainPark":false,"baseElevation":78,"summitElevation":528,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.37,"intermediate":0.5,"advanced":0.13},"rating":3.0,"ratingCount":52,"website":"https://www.springmountain.com"},{"id":"tussey-mountain","name":"Tussey Mountain","state":"PA","region":"Pennsylvania","passGroup":"Independent","ownerGroup":"Independent / local","lat":40.21,"lon":-78.33222,"vertical":520,"trails":27,"lifts":5,"acres":65,"longestRun":0.3,"snowmaking":3000,"price":78,"night":false,"terrainPark":false,"baseElevation":1230,"summitElevation":1750,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.4,"intermediate":0.4,"advanced":0.0},"rating":3.0,"ratingCount":12,"website":"https://www.tusseymountain.com"},{"id":"whitetail-resort","name":"Whitetail","state":"PA","region":"Pennsylvania","passGroup":"Epic","ownerGroup":"Epic network","lat":39.74177,"lon":-77.93328,"vertical":935,"trails":39,"lifts":7,"acres":171,"longestRun":1.0,"snowmaking":12000,"price":127,"night":false,"terrainPark":true,"baseElevation":865,"summitElevation":1800,"avgSnowfall":90,"terrainBreakdown":{"beginner":0.32,"intermediate":0.45,"advanced":0.0},"rating":3.2,"ratingCount":61,"website":"https://www.whitetailresort.com"},{"id":"yawgoo-valley","name":"Yawgoo Valley","state":"RI","region":"Rhode Island","passGroup":"Independent","ownerGroup":"Independent / local","lat":41.5176,"lon":-71.52726,"vertical":245,"trails":19,"lifts":4,"acres":29,"longestRun":0.2,"snowmaking":3000,"price":71,"night":true,"terrainPark":false,"baseElevation":70,"summitElevation":315,"avgSnowfall":60,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.3,"ratingCount":5,"website":"https://www.yawgoo.com"},{"id":"bolton-valley","name":"Bolton Valley","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.42099,"lon":-72.85033,"vertical":1704,"trails":61,"lifts":6,"acres":256,"longestRun":0.6,"snowmaking":9000,"price":86,"night":true,"terrainPark":false,"baseElevation":1446,"summitElevation":3150,"avgSnowfall":238,"terrainBreakdown":{"beginner":0.34,"intermediate":0.38,"advanced":0.23},"rating":3.2,"ratingCount":34,"website":"https://www.boltonvalley.com"},{"id":"bromley-mountain","name":"Bromley","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":43.22785,"lon":-72.93871,"vertical":1334,"trails":50,"lifts":7,"acres":411,"longestRun":2.5,"snowmaking":15500,"price":104,"night":true,"terrainPark":false,"baseElevation":1950,"summitElevation":3284,"avgSnowfall":244,"terrainBreakdown":{"beginner":0.3,"intermediate":0.36,"advanced":0.32},"rating":3.2,"ratingCount":24,"website":"https://www.bromley.com"},{"id":"burke-mountain","name":"Burke Mountain","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.57117,"lon":-71.89232,"vertical":2011,"trails":69,"lifts":4,"acres":570,"longestRun":2.2,"snowmaking":12500,"price":99,"night":false,"terrainPark":false,"baseElevation":1210,"summitElevation":3267,"avgSnowfall":243,"terrainBreakdown":{"beginner":0.11,"intermediate":0.46,"advanced":0.34},"rating":3.2,"ratingCount":23,"website":"https://www.skiburke.com"},{"id":"jay-peak","name":"Jay Peak","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":44.93794,"lon":-72.50452,"vertical":2153,"trails":74,"lifts":6,"acres":754,"longestRun":3.0,"snowmaking":30000,"price":107,"night":false,"terrainPark":true,"baseElevation":1815,"summitElevation":3968,"avgSnowfall":278,"terrainBreakdown":{"beginner":0.2,"intermediate":0.4,"advanced":0.4},"rating":3.5,"ratingCount":111,"website":"https://www.jaypeakresort.com"},{"id":"killington-resort","name":"Killington","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.6198,"lon":-72.80271,"vertical":3050,"trails":99,"lifts":11,"acres":1830,"longestRun":6.0,"snowmaking":50000,"price":179,"night":false,"terrainPark":true,"baseElevation":1165,"summitElevation":4241,"avgSnowfall":292,"terrainBreakdown":{"beginner":0.28,"intermediate":0.33,"advanced":0.24},"rating":3.6,"ratingCount":174,"website":"https://www.killington.com"},{"id":"mad-river-glen","name":"Mad River Glen","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.20248,"lon":-72.91754,"vertical":2037,"trails":70,"lifts":3,"acres":373,"longestRun":1.0,"snowmaking":1600,"price":102,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":3637,"avgSnowfall":262,"terrainBreakdown":{"beginner":0.2,"intermediate":0.35,"advanced":0.45},"rating":3.2,"ratingCount":26,"website":"https://www.madriverglen.com"},{"id":"magic-mountain","name":"Magic Mountain","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.20171,"lon":-72.77264,"vertical":1500,"trails":55,"lifts":3,"acres":350,"longestRun":1.6,"snowmaking":9500,"price":91,"night":false,"terrainPark":false,"baseElevation":1350,"summitElevation":2850,"avgSnowfall":222,"terrainBreakdown":{"beginner":0.3,"intermediate":0.3,"advanced":0.15},"rating":3.3,"ratingCount":27,"website":"https://www.magicmtn.com"},{"id":"middlebury-snow-bowl","name":"Middlebury Snow Bowl","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.9612,"lon":-73.0122,"vertical":1020,"trails":17,"lifts":4,"acres":100,"longestRun":1.2,"snowmaking":80,"price":69,"night":false,"terrainPark":false,"baseElevation":1600,"summitElevation":2620,"avgSnowfall":150,"terrainBreakdown":{"beginner":0.22,"intermediate":0.4,"advanced":0.38},"rating":3.8,"ratingCount":50,"website":"https://www.middlebury.edu/snowbowl"},{"id":"mount-snow","name":"Mount Snow","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":42.96368,"lon":-72.88753,"vertical":1700,"trails":61,"lifts":10,"acres":453,"longestRun":2.0,"snowmaking":48000,"price":146,"night":false,"terrainPark":true,"baseElevation":1900,"summitElevation":3600,"avgSnowfall":260,"terrainBreakdown":{"beginner":0.14,"intermediate":0.73,"advanced":0.13},"rating":3.4,"ratingCount":106,"website":"https://www.mountsnow.com"},{"id":"okemo-mountain-resort","name":"Okemo","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":43.40156,"lon":-72.717,"vertical":2200,"trails":75,"lifts":12,"acres":953,"longestRun":4.0,"snowmaking":65400,"price":164,"night":false,"terrainPark":true,"baseElevation":1144,"summitElevation":3344,"avgSnowfall":247,"terrainBreakdown":{"beginner":0.32,"intermediate":0.37,"advanced":0.23},"rating":3.8,"ratingCount":100,"website":"https://www.okemo.com"},{"id":"pico-mountain-at-killington","name":"Pico","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.65136,"lon":-72.841,"vertical":1967,"trails":68,"lifts":3,"acres":852,"longestRun":4.0,"snowmaking":15600,"price":156,"night":false,"terrainPark":true,"baseElevation":2000,"summitElevation":3967,"avgSnowfall":278,"terrainBreakdown":{"beginner":0.18,"intermediate":0.46,"advanced":0.33},"rating":3.4,"ratingCount":29,"website":"https://www.picomountain.com"},{"id":"suicide-six","name":"Saskadena Six","state":"VT","region":"Vermont","passGroup":"Indy","ownerGroup":"Indy + independent","lat":43.66506,"lon":-72.54327,"vertical":650,"trails":31,"lifts":3,"acres":87,"longestRun":0.4,"snowmaking":5000,"price":75,"night":false,"terrainPark":false,"baseElevation":550,"summitElevation":1200,"avgSnowfall":180,"terrainBreakdown":{"beginner":0.3,"intermediate":0.4,"advanced":0.3},"rating":3.2,"ratingCount":12,"website":"https://www.saskadena6.com"},{"id":"smugglers-notch-resort","name":"Smugglers' Notch","state":"VT","region":"Vermont","passGroup":"Independent","ownerGroup":"Independent / local","lat":44.58847,"lon":-72.79005,"vertical":2610,"trails":87,"lifts":8,"acres":914,"longestRun":3.0,"snowmaking":19200,"price":120,"night":false,"terrainPark":true,"baseElevation":1030,"summitElevation":3640,"avgSnowfall":262,"terrainBreakdown":{"beginner":0.19,"intermediate":0.5,"advanced":0.25},"rating":3.3,"ratingCount":71,"website":"https://www.smuggs.com"},{"id":"stowe-mountain-resort","name":"Stowe","state":"VT","region":"Vermont","passGroup":"Epic","ownerGroup":"Epic network","lat":44.52973,"lon":-72.77927,"vertical":2360,"trails":79,"lifts":9,"acres":964,"longestRun":3.7,"snowmaking":38800,"price":162,"night":false,"terrainPark":true,"baseElevation":2035,"summitElevation":4395,"avgSnowfall":300,"terrainBreakdown":{"beginner":0.16,"intermediate":0.55,"advanced":0.15},"rating":3.3,"ratingCount":77,"website":"https://www.stowe.com"},{"id":"stratton-mountain","name":"Stratton","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":43.11344,"lon":-72.90813,"vertical":2003,"trails":69,"lifts":6,"acres":701,"longestRun":3.0,"snowmaking":57000,"price":150,"night":false,"terrainPark":true,"baseElevation":1872,"summitElevation":3875,"avgSnowfall":274,"terrainBreakdown":{"beginner":0.41,"intermediate":0.31,"advanced":0.17},"rating":3.2,"ratingCount":90,"website":"https://www.stratton.com"},{"id":"sugarbush","name":"Sugarbush","state":"VT","region":"Vermont","passGroup":"Ikon","ownerGroup":"Ikon network","lat":44.13611,"lon":-72.89442,"vertical":2600,"trails":86,"lifts":9,"acres":910,"longestRun":3.0,"snowmaking":35600,"price":157,"night":false,"terrainPark":true,"baseElevation":1483,"summitElevation":4083,"avgSnowfall":284,"terrainBreakdown":{"beginner":0.23,"intermediate":0.42,"advanced":0.27},"rating":3.4,"ratingCount":83,"website":"https://www.sugarbush.com"}];

// ─── Named scoring constants (audit #32) ─────────────────────────────────────
const SCORING = Object.freeze({
  // Mountain Size index — ceilings set at p80 of dataset so ~20% of mountains reach max
  VERTICAL_CEILING:    2000,  // p80 — 18 mountains at or above this
  ACRES_CEILING:        800,  // p80 — 19 mountains at or above this
  LONGEST_RUN_CEILING:  4.0,  // miles — Killington 6mi gets capped, fair spread
  // Snow — live forecast + historical reliability blend
  SNOW_SCALE:             8,  // inches — 8"+ = max live forecast score
  SNOW_AVG_MAX:         300,  // Stowe — highest historical avg in dataset
  SNOW_FORECAST_WEIGHT: 0.6,  // live forecast counts 60%
  SNOW_RELIABILITY_WEIGHT: 0.4, // avgSnowfall reliability counts 40%
  // Drive
  DRIVE_SCALE:          300,  // minutes — 5 hrs = zero drive score
  DRIVE_DEFAULT:        0.5,  // fallback when no origin set
  // Value
  PRICE_MAX:            179,  // Killington
  PRICE_MIN:             45,  // McIntyre (realistic floor)
  // Crowd
  CROWD_SCALE:           85,
});

// Drive filter ranges — index stored in state.maxDrive (0 = any)
const DRIVE_RANGES = Object.freeze([
  { label: 'Any distance',   min: 0,   max: Infinity },
  { label: 'Under 90 min',   min: 0,   max: 90       },
  { label: '90 – 150 min',   min: 90,  max: 150      },
  { label: '151 – 210 min',  min: 151, max: 210      },
  { label: '211 – 300 min',  min: 211, max: 300      },
  { label: '301+ min',       min: 301, max: Infinity },
]);

// Pass break-even prices (audit #39)
const PASS_PRICES = Object.freeze({ Indy: 349, Epic: 909, Ikon: 799 });

const PRESETS = {
  // weights: snow, drive, size (vertical+acres), value, crowd — skill stored separately
  balanced: { snow:6, drive:4, size:5, value:4, crowd:3 },
  powder:   { snow:10, drive:2, size:4, value:2, crowd:2 },
  family:   { snow:4, drive:6, size:3, value:6, crowd:5 },
  cheap:    { snow:3, drive:8, size:2, value:9, crowd:2 },
};

// Skill presets per named preset
const PRESET_SKILLS = {
  balanced: 'mixed', powder: 'advanced', family: 'beginner', cheap: 'mixed',
};

// Table sort state — dir tracked separately from URL state
let tableSort = { col: 'planner', dir: 'desc' };

// AI chat loading state — not in sealed state, only needed locally
let aiChatLoading = false;

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
function loadSavedWeights() {
  // Always start with balanced defaults — do not restore from localStorage
  try { localStorage.removeItem('ski-planner-weights'); } catch (e) {}
  return { ...PRESETS.balanced };
}

function loadSavedSkillLevel() {
  // Always default to mixed — do not restore from localStorage
  return 'mixed';
}
function loadSavedPassPreference() {
  // Always default to any — do not restore from localStorage
  return 'any';
}
function loadSavedPreset() {
  // Always default to balanced — do not restore from localStorage
  return 'balanced';
}
function loadSavedSkiDays() {
  try { return Number(localStorage.getItem('ski-ski-days') || 5); } catch (e) { return 5; }
}

const state = Object.seal({
  search:       '',
  passFilter:   'All',
  stateFilter:  'All',
  sortBy:       'planner',
  nightOnly:    false,
  daytripOnly:  false,
  maxDrive:     0,
  selectedId:   null,
  origin:       null,
  driveCache:   {},
  weatherCache: {},
  compareSet:   new Set(),
  mapMode:      'drive',
  preset:       loadSavedPreset(),
  weights:      loadSavedWeights(),
  skillLevel:   loadSavedSkillLevel(),
  passPreference: loadSavedPassPreference(),
  skiDays:      loadSavedSkiDays(),
  tableSearch:  '',
  tableViewAll: false,
});

// ─── Element cache ────────────────────────────────────────────────────────────
const els = {
  verdictSection:      $('verdictSection'),
  verdictCard:         $('verdictCard'),
  summaryCards:        $('summaryCards'),
  passFilter:          $('passFilter'),
  stateFilter:         $('stateFilter'),
  maxDriveFilter:      $('maxDriveFilter'),
  sortBy:              $('sortBy'),
  toggleNight:         $('toggleNight'),
  toggleDaytrip:        $('toggleDaytrip'),
  resetFilters:        $('resetFilters'),
  plannerToggle:       $('plannerToggle'),
  plannerDetails:      $('plannerDetails'),
  plannerSection:      $('plannerSection'),
  activeFilters:       $('activeFilters'),
  originInput:         $('originInput'),
  setLocation:         $('setLocation'),
  detectLocation:      $('detectLocation'),
  locationStatus:      $('locationStatus'),
  weightSummary:       $('weightSummary'),
  snowWeight:    $('snowWeight'),    driveWeight:  $('driveWeight'),
  sizeWeight:    $('sizeWeight'),    valueWeight:  $('valueWeight'),   crowdWeight: $('crowdWeight'),
  snowWeightVal: $('snowWeightVal'), driveWeightVal: $('driveWeightVal'),
  sizeWeightVal: $('sizeWeightVal'), valueWeightVal: $('valueWeightVal'), crowdWeightVal: $('crowdWeightVal'),
  stormGrid:           $('stormGrid'),        hiddenGemGrid:     $('hiddenGemGrid'),
  tableSearch:         $('tableSearch'),      tableViewAllBtn:   $('tableViewAllBtn'),
  resultCount:         $('resultCount'),
  comparisonBody:      $('comparisonBody'),
  mobileCardGrid:      $('mobileCardGrid'),
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
  // AI Chat
  aiChatInput:         $('aiChatInput'),
  aiChatBtn:           $('aiChatBtn'),
  aiChatResult:        $('aiChatResult'),
  // Best Day section
  bestDaySection:      $('bestDaySection'),
  bestDayGrid:         $('bestDayGrid'),
  bestDayLastUpdated:  $('bestDayLastUpdated'),
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
    p.set('w', [w.snow, w.drive, w.size, w.value, w.crowd].join(','));
    if (state.skillLevel && state.skillLevel !== 'mixed') p.set('skill', state.skillLevel);
  }
  if (state.passFilter  !== 'All')     p.set('pass',  state.passFilter);
  if (state.stateFilter !== 'All')     p.set('st',    state.stateFilter);
  if (state.sortBy      !== 'planner') p.set('sort',  state.sortBy);
  if (state.nightOnly)                 p.set('night', '1');
  if (state.daytripOnly)               p.set('daytrip', '1');
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
      const [snow, drive, size, value, crowd] = parts;
      if (parts.length === 5 && parts.every(n => !isNaN(n) && n >= 0)) {
        state.weights = { snow, drive, size, value, crowd };
      }
    }
  }
  if (p.has('pass')  && UNIQUE_PASSES.includes(p.get('pass')))  state.passFilter  = p.get('pass');
  if (p.has('st')    && UNIQUE_STATES.includes(p.get('st')))    state.stateFilter = p.get('st');
  if (p.has('sort'))  state.sortBy    = p.get('sort');
  if (p.has('night'))   state.nightOnly   = true;
  if (p.has('daytrip')) state.daytripOnly = true;
  if (p.has('drive')) state.maxDrive  = Number(p.get('drive')) || 0;
  if (p.has('days'))  state.skiDays   = Math.max(1, Number(p.get('days')) || 5);
  if (p.has('skill') && ['beginner','mixed','advanced'].includes(p.get('skill'))) state.skillLevel = p.get('skill');

  const lat = parseFloat(p.get('lat'));
  const lon = parseFloat(p.get('lon'));
  const loc = p.get('loc');
  if (!isNaN(lat) && !isNaN(lon) && loc) {
    state.origin = { lat, lon, label: loc };
  }
  return true;
}

const pushUrlDebounced = debounce(() => {
  const p    = serializeState();
  const hash = location.hash || '';           // preserve #resort-xxx if present
  const base = p.toString() ? `${location.pathname}?${p}` : location.pathname;
  history.replaceState(null, '', base + hash);
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

function computeVerdict(resorts) {
  // Score from the full filtered set — same pool as the table, so #1 always matches
  const withWx = resorts.filter(r => state.weatherCache[r.id]?.data);
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
  } else if (stormTotal >= 2 || (histTotal !== null && histTotal >= 6)) {
    tier = 'good'; icon = '⛷️'; headline = 'Decent conditions — worth the trip';
    if (stormTotal >= 2) {
      detail = `${stormTotal.toFixed(1)}" in the 3-day forecast at ${esc(resort.name)}. Not a powder day, but fresh snow makes a real difference.`;
    } else if (histTotal !== null && histTotal >= 6) {
      detail = `${histTotal}" fell in the past week at ${esc(resort.name)}. Expect a solid, well-consolidated base even without new snow this weekend.`;
    } else {
      detail = `Decent base at ${esc(resort.name)} with no major storm in the forecast — groomed trails should be in good shape.`;
    }
    if (warmCaution) subPoints.push('Snow may be dense/wet — get out early for the best runs');
  } else if (stormTotal >= 0.5) {
    tier = 'marginal'; icon = '🤔'; headline = 'Marginal — manage your expectations';
    detail = stormTotal >= 0.5
      ? `Only ${stormTotal.toFixed(1)}" in the forecast at ${esc(resort.name)}. You're mostly working with the existing base — groomed runs will be fine, off-piste less so.`
      : `No new snow expected at ${esc(resort.name)}. Conditions will depend on the existing groomed base.`;
    subPoints.push('Stick to groomed trails, get out early, avoid south-facing terrain');
  } else {
    tier = 'bad'; icon = '❌'; headline = 'Probably skip this one';
    detail = `Less than half an inch forecast and limited recent snowfall at ${esc(resort.name)}. Not a great weekend for conditions.`;
  }

  return {
    tier, icon, headline, detail, subPoints,
    resort, breakdown, drive, driveText,
    tomorrowIn, stormTotal, histTotal, histDays,
  };
}

function renderVerdict(resorts) {
  if (!els.verdictSection) return;
  const v = computeVerdict(resorts);
  if (!v) { els.verdictSection.classList.add('hidden'); return; }
  els.verdictSection.classList.remove('hidden');

  const { tier, icon, headline, detail, subPoints,
          resort, breakdown, driveText,
          tomorrowIn, stormTotal, histTotal, histDays } = v;

  const brief = buildDecisionBrief(resorts);
  const { context, backup, top5 } = brief;
  const primaryItem = brief.primary;

  const histChip  = histTotal !== null
    ? `<span class="metric-chip">📅 ${histTotal}" last 7 days</span>` : '';
  const driveChip = driveText
    ? `<span class="metric-chip">🚗 ${driveText}</span>` : '';
  const subList   = subPoints.length
    ? `<ul class="verdict-points">${subPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : '';
  const spark     = histDays ? snowSparkline(histDays) : '';
  const noOrigin  = !state.origin
    ? `<p class="verdict-no-origin">📍 Set your starting location for drive times and distance-weighted picks.</p>` : '';

  // Editorial reasons for the top pick
  const reasons = primaryItem ? primaryReasons(primaryItem) : [];
  const reasonsHtml = reasons.length
    ? `<div class="verdict-reasons">${reasons.map(r => `<span class="verdict-reason-chip">✓ ${esc(r)}</span>`).join('')}</div>`
    : '';

  // Backup mountain block
  const backupHtml = backup ? (() => {
    const reason = backupReason(primaryItem, backup);
    const bDrive = formatDrive(backup.resort.id);
    return `<div class="verdict-backup">
      <div class="verdict-backup-label">Also consider</div>
      <div class="verdict-backup-name">${esc(backup.resort.name)}</div>
      <div class="verdict-backup-meta">${esc(backup.resort.state)} · Ski Score ${backup.ski.skiScore} · ${reason}${bDrive !== '—' ? ' · ' + bDrive : ''}</div>
    </div>`;
  })() : '';

  // Top-5 strip (skip #1 — it's already shown as top pick)
  const top5Html = top5.length > 1
    ? `<div class="verdict-top5">
        <div class="verdict-top5-label">Also in the running</div>
        <div class="verdict-top5-chips">${top5.slice(1).map((item, i) =>
          `<span class="metric-chip">#${i + 2} ${esc(item.resort.name)} · ${item.ski.skiScore}</span>`
        ).join('')}</div>
      </div>`
    : '';

  els.verdictCard.innerHTML = `
    <div class="verdict-inner verdict-${tier}">
      <div class="verdict-left">
        <div class="verdict-icon" aria-hidden="true">${icon}</div>
        <div class="verdict-body">
          <div class="verdict-context-headline">${esc(context.headline)}</div>
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
          <div class="verdict-pick-meta">${esc(resort.state)} · ${esc(resort.passGroup)} · Ski Score ${breakdown.score}</div>
        </div>
        ${reasonsHtml}
        ${spark ? `<div class="verdict-spark-wrap"><span class="verdict-spark-label">Last 7 days</span>${spark}</div>` : ''}
        <div class="verdict-chips">
          <span class="metric-chip">❄️ ${tomorrowIn.toFixed(1)}" tomorrow</span>
          <span class="metric-chip">🌨 ${stormTotal.toFixed(1)}" 3-day</span>
          ${histChip}
          ${driveChip}
        </div>
        ${backupHtml}
        ${top5Html}
        <button class="btn btn-secondary verdict-share-btn" id="verdictShareBtn">&#127920; Share this pick</button>
      </div>
    </div>`;

  const _shareBtn = $('verdictShareBtn');
  if (_shareBtn) _shareBtn.addEventListener('click', () => shareVerdict(resort, v));
}

function savePlannerState() {
  try {
    localStorage.setItem('ski-planner-weights', JSON.stringify(state.weights));
    localStorage.setItem('ski-planner-preset',  state.preset);
    localStorage.setItem('ski-skill-level',      state.skillLevel);
    localStorage.setItem('ski-pass-pref',         state.passPreference);
    localStorage.setItem('ski-ski-days',         String(state.skiDays));
  } catch (e) { /* quota exceeded — silent */ }
}

function syncPlannerControls() {
  const KEYS = [
    ['snow',  'snowWeight',  'snowWeightVal'],
    ['drive', 'driveWeight', 'driveWeightVal'],
    ['size',  'sizeWeight',  'sizeWeightVal'],
    ['value', 'valueWeight', 'valueWeightVal'],
    ['crowd', 'crowdWeight', 'crowdWeightVal'],
  ];
  KEYS.forEach(([key, inputId, valueId]) => {
    if (els[inputId])  els[inputId].value = state.weights[key] ?? 1;
    if (els[valueId])  els[valueId].textContent = `${state.weights[key] ?? 1}/10`;
  });

  // Sync skill buttons
  document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.skill === state.skillLevel);
  });

  // Sync pass preference buttons
  document.querySelectorAll('.pass-pref-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pass === state.passPreference);
  });

  const w = state.weights;
  const skillLabel = { beginner: 'Beginner 🟢', mixed: 'All Levels 🔵', advanced: 'Advanced ⚫' }[state.skillLevel] || 'All Levels';
  const passLabel  = state.passPreference === 'any' ? 'Any' : `${state.passPreference} (+10 pts)`;
  els.weightSummary.innerHTML =
    `<strong>Active profile:</strong> ` +
    `Snow ${w.snow}/10 · Drive ${w.drive}/10 · Size ${w.size}/10 · ` +
    `Value ${w.value}/10 · Crowds ${w.crowd}/10 · Skill: ${skillLabel} · Pass: ${passLabel} ` +
    `<span style="color:var(--muted)">— sliders are independent (1 = low priority, 10 = must-have)</span>`;

  presetBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.preset === state.preset));
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));
}

function applyPreset(name) {
  if (!PRESETS[name]) { console.warn(`Unknown preset: ${name}`); return; }
  state.preset = name;
  state.weights = { ...PRESETS[name] };
  if (PRESET_SKILLS[name]) state.skillLevel = PRESET_SKILLS[name];
  savePlannerState();
  syncPlannerControls();
  render();
}

// Compute normalized weights once — callers pass this in to avoid repeated work (audit #5)
function normalizedWeights() {
  const total = Object.values(state.weights).reduce((s, v) => s + v, 0) || 1;
  return Object.fromEntries(Object.entries(state.weights).map(([k, v]) => [k, v / total]));
}

// Human-readable labels for weight keys (used in UI summaries)
const WEIGHT_LABELS = Object.freeze({
  snow: 'Snow Quality', drive: 'Drive Time', size: 'Mountain Size',
  value: 'Best Value', crowd: 'Avoid Crowds',
});

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
  let score = 35;
  const reasons = [];

  // Day-of-week effect
  const day = new Date().getDay(); // 0=Sun, 6=Sat
  if (day === 6)                { score += 20; reasons.push('Saturday — busiest ski day'); }
  else if (day === 0)           { score += 12; reasons.push('Sunday traffic'); }
  else if (day === 5)           { score += 6;  reasons.push('Friday arrivals'); }
  else if (day >= 1 && day <= 4){ score -= 12; reasons.push('Midweek traffic drop'); }

  // Night-only filter draws after-work crowds
  if (state.nightOnly) { score += 8; reasons.push('After-work night crowd'); }

  // Drive distance
  const drive = getDriveMins(resort.id);
  if (drive !== null) {
    if (drive <= 90)       { score += 16; reasons.push('Easy day-trip distance'); }
    else if (drive <= 150) { score += 8; }
    else if (drive >= 240) { score -= 8;  reasons.push('Long drive filters casual traffic'); }
  }

  // Pass network size
  if (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon') {
    score += 10; reasons.push('Major pass — large network traffic');
  } else if (resort.passGroup === 'Indy') {
    score += 4;
  }

  // Mountain draw factors
  if (resort.vertical >= 1800) { score += 6; reasons.push('Big-mountain draw'); }
  if (resort.terrainPark)       { score += 4; reasons.push('Terrain park attracts crowds'); }
  if (resort.night)             { score += 5; reasons.push('Night skiing draws extra traffic'); }
  if (resort.price <= 85)       { score += 4; reasons.push('Value pricing drives volume'); }

  score = Math.max(5, Math.min(SCORING.CROWD_SCALE, score));

  let label;
  if (score >= 70)      label = 'Heavy';
  else if (score >= 52) label = 'Moderate';
  else if (score >= 35) label = 'Light-Moderate';
  else                  label = 'Light';

  return { score, label, confidence: 'Medium', reasons };
}

// Accept pre-computed normalized weights to avoid repeated computation (audit #5, #6)
// ─── Mountain Size Index ─────────────────────────────────────────────────────
// Replaces the old separate Vertical + Trails metrics.
// vertical(50%) + acres(35%) + longestRun(15%) with p80 ceilings so ~20% of
// mountains can reach a perfect score — far better spread than a single-metric max.
function mountainSizeIndex(resort) {
  const v = Math.min(1, resort.vertical    / SCORING.VERTICAL_CEILING);
  const a = Math.min(1, resort.acres       / SCORING.ACRES_CEILING);
  const l = Math.min(1, resort.longestRun  / SCORING.LONGEST_RUN_CEILING);
  return v * 0.50 + a * 0.35 + l * 0.15;
}

// ─── Snow Quality Index ───────────────────────────────────────────────────────
// Blends live 3-day forecast snow (60%) with historical annual avg (40%).
// This fixes the core reliability gap: on a no-storm day, Stowe (300" avg) now
// beats Yawgoo RI (60" avg) on snow score — as it should.
function snowQualityIndex(resort, snowTotal) {
  const live        = Math.min(1, snowTotal / SCORING.SNOW_SCALE);
  const reliability = Math.min(1, resort.avgSnowfall / SCORING.SNOW_AVG_MAX);
  return live * SCORING.SNOW_FORECAST_WEIGHT + reliability * SCORING.SNOW_RELIABILITY_WEIGHT;
}

// ─── Skill Match Index ────────────────────────────────────────────────────────
// Scores how well a mountain's terrain mix matches the user's skill level.
// beginners want gentle runs; advanced want expert terrain; mixed wants balance.
function skillMatchIndex(resort) {
  const tb = resort.terrainBreakdown;
  const skill = state.skillLevel || 'mixed';
  if (skill === 'beginner') {
    // Reward high beginner% + intermediate%; penalize heavy-expert mountains
    return Math.min(1, (tb.beginner || 0) * 1.2 + (tb.intermediate || 0) * 0.5);
  } else if (skill === 'advanced') {
    // Reward advanced% + steep intermediate%; also factor in vertical
    const terrainScore = Math.min(1, (tb.advanced || 0) * 1.4 + (tb.intermediate || 0) * 0.3);
    const vertBonus    = Math.min(0.2, resort.vertical / SCORING.VERTICAL_CEILING * 0.2);
    return Math.min(1, terrainScore + vertBonus);
  } else { // mixed / all-levels
    // Reward balanced mountains — high in all tiers, penalize extreme single-tier
    const balance = 1 - Math.abs((tb.beginner||0) - (tb.advanced||0));
    return Math.max(0.3, balance); // floor of 0.3 — no mountain is totally wrong for mixed
  }
}

function plannerScoreBreakdown(resort, weather, forecastIndex = null, w = null) {
  if (!w) w = normalizedWeights();
  const forecast  = weather?.forecast || [];
  const picks     = forecastIndex === null ? forecast : (forecast[forecastIndex] ? [forecast[forecastIndex]] : []);
  const snowTotal = picks.reduce((sum, f) => sum + (f.snow || 0), 0);
  const drive     = getDriveMins(resort.id);
  const crowd     = crowdForecast(resort);

  const normalized = {
    snow:         snowQualityIndex(resort, snowTotal),
    drive:        drive !== null ? Math.max(0, 1 - drive / SCORING.DRIVE_SCALE) : SCORING.DRIVE_DEFAULT,
    size:         mountainSizeIndex(resort),
    skillMatch:   skillMatchIndex(resort),
    value:        Math.max(0, Math.min(1, (SCORING.PRICE_MAX - resort.price) / (SCORING.PRICE_MAX - SCORING.PRICE_MIN))),
    crowdPenalty: Math.min(1, crowd.score / SCORING.CROWD_SCALE),
  };

  const components = {
    snow:         normalized.snow         * (w.snow  || 0) * 100,
    drive:        normalized.drive        * (w.drive || 0) * 100,
    size:         normalized.size         * (w.size  || 0) * 100,
    skillMatch:   normalized.skillMatch   * 0.5 * 100,  // always-on bonus, not slider-weighted
    value:        normalized.value        * (w.value || 0) * 100,
    crowdPenalty: normalized.crowdPenalty * (w.crowd || 0) * 100,
  };

  let score = components.snow + components.drive + components.size +
              components.skillMatch + components.value - components.crowdPenalty;
  // Pass preference bonus — +200 for mountains on your pass (~10% of typical max score)
  if (state.passPreference && state.passPreference !== 'any' && resort.passGroup === state.passPreference) score += 200;
  if (state.nightOnly && resort.night) score += 4;

  return { score: Math.round(score * 10) / 10, snowTotal, drive, resortId: resort.id, crowdLabel: crowd.label, normalized, components };
}

// ─── Ski Score (public-facing wrapper around plannerScoreBreakdown) ────────────
// Provides a branded score + rounded factor breakdown for all UI surfaces.
function skiScoreBreakdown(resort, weather, forecastIndex = null) {
  const w    = normalizedWeights();
  const base = plannerScoreBreakdown(resort, weather, forecastIndex, w);
  return {
    ...base,
    skiScore: Math.round(base.score),
    factors: {
      snow:         Math.round(base.components.snow),
      drive:        Math.round(base.components.drive),
      size:         Math.round(base.components.size),
      skill:        Math.round(base.components.skillMatch),
      value:        Math.round(base.components.value),
      crowdPenalty: Math.round(base.components.crowdPenalty),
    },
  };
}

// ─── Primary + Backup mountain picker ────────────────────────────────────────
// Selects the top pick plus a "safer" backup (lower crowds, shorter drive,
// lower weather risk, or better value) for display in the verdict card.
// ─── Decision context (time/day/trip-type aware) ──────────────────────────────
function getDecisionContext() {
  const now  = new Date();
  const day  = now.getDay();   // 0 Sun … 6 Sat
  const hour = now.getHours();

  const hasNight   = state.nightOnly   === true;
  const hasDayTrip = state.daytripOnly === true;
  const hasOrigin  = !!state.origin;

  let timeframe;
  if (hasNight) {
    timeframe = 'tonight';
  } else if (day >= 1 && day <= 4) {
    timeframe = hour < 15 ? 'today' : 'tomorrow';
  } else if (day === 5) {
    timeframe = hour < 15 ? 'today' : 'this weekend';
  } else {
    timeframe = 'today';
  }

  const tripType = hasNight ? 'night ski' : hasDayTrip ? 'day trip' : 'ski';
  const audience = hasOrigin && state.origin.label ? state.origin.label : null;

  return {
    timeframe,
    tripType,
    audience,
    headline: `Best places to ${tripType} ${timeframe}`,
    subhead: audience
      ? `Ranked from ${audience} using live conditions, drive time, crowds, and your score settings.`
      : `Ranked using live conditions, crowds, and your score settings. Add your location for drive-based picks.`,
  };
}

// ─── Weather risk score (0–100) ───────────────────────────────────────────────
function weatherRiskScore(wx) {
  if (!wx) return 50;
  let risk = 0;
  const wind  = wx.wind  || 0;
  const temp  = wx.temp  || 30;
  const storm = (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
  if (wind >= 30)  risk += 30;
  else if (wind >= 20) risk += 15;
  if (temp >= 38)  risk += 20;
  else if (temp >= 34) risk += 10;
  if (storm <= 1)  risk += 5;
  return Math.max(0, Math.min(100, risk));
}

// ─── Backup reason ────────────────────────────────────────────────────────────
function backupReason(primary, backup) {
  if (!primary || !backup) return 'solid fallback';
  if (backup.crowd.score     < primary.crowd.score - 8)  return 'lighter crowds';
  if ((backup.drive ?? 999)  < (primary.drive ?? 999) - 20) return 'shorter drive';
  if (backup.risk            < primary.risk - 10)         return 'lower weather risk';
  if (backup.resort.price    < primary.resort.price - 10) return 'better value';
  return 'strong alternate if plans change';
}

// ─── Editorial reasons for the primary pick ───────────────────────────────────
function primaryReasons(item) {
  if (!item) return [];
  const reasons = [];
  const storm = item.storm || 0;

  if (item.ski.skiScore >= 85) reasons.push(`Elite Ski Score (${item.ski.skiScore})`);
  else                          reasons.push(`Strong Ski Score (${item.ski.skiScore})`);

  if (storm >= 6) reasons.push(`${storm.toFixed(1)}" forecast over 3 days`);
  const drive = item.drive;
  if (drive !== null && drive !== undefined && drive <= 120)
    reasons.push(`Easy drive at ${formatDrive(item.resort.id)}`);
  const cLabel = item.crowd?.label || '';
  if (cLabel === 'Light' || cLabel === 'Light-Moderate')
    reasons.push('Lighter crowd outlook');
  if (state.nightOnly && item.resort.night)
    reasons.push('Night skiing available');
  if (state.passPreference && state.passPreference !== 'All' &&
      item.resort.passGroup === state.passPreference)
    reasons.push(`${item.resort.passGroup} pass access`);

  return reasons.slice(0, 3);
}

// ─── Decision brief (replaces findPrimaryAndBackup, adds context + top5) ─────
function buildDecisionBrief(resorts) {
  const context = getDecisionContext();

  const scored = resorts
    .map(resort => {
      const wx = state.weatherCache[resort.id]?.data;
      if (!wx) return null;
      const ski   = skiScoreBreakdown(resort, wx, 0);
      const crowd = crowdForecast(resort);
      const drive = getDriveMins(resort.id) ?? null;
      const risk  = weatherRiskScore(wx);
      const storm = (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
      return { resort, wx, ski, crowd, drive, risk, storm };
    })
    .filter(Boolean)
    .sort((a, b) => b.ski.skiScore - a.ski.skiScore);

  if (!scored.length) return { context, primary: null, backup: null, top5: [] };

  const primary = scored[0];
  const backup  = scored.slice(1).find(x =>
    x.crowd.score      <= primary.crowd.score      ||
    (x.drive ?? 999)   <= (primary.drive ?? 999)   ||
    x.risk             <  primary.risk
  ) || scored[1] || null;

  return { context, primary, backup, top5: scored.slice(0, 5) };
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
  if (state.maxDrive > 0)      filters.push(`Drive: ${DRIVE_RANGES[state.maxDrive]?.label ?? ''}${state.origin ? '' : ' (set location to activate)'}`);
  if (state.passFilter !== 'All')  filters.push(`Pass: ${esc(state.passFilter)}`);
  if (state.stateFilter !== 'All') filters.push(`State: ${esc(state.stateFilter)}`);
  if (state.nightOnly)         filters.push('Night only');
  if (state.daytripOnly)        filters.push('Day trip (≤150 min)' + (state.origin ? '' : ' — set location to activate'));
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
    if (state.daytripOnly && state.origin) {
      const mins = getDriveMins(r.id);
      if (mins !== null && mins > 150) return false;
    }
    if (state.maxDrive > 0 && state.origin) {
      const range = DRIVE_RANGES[state.maxDrive];
      if (range) {
        const mins = getDriveMins(r.id);
        if (mins !== null && (mins < range.min || mins > range.max)) return false;
      }
    }
    return true;
  });
}

function staticSort(resorts) {
  const sorted = [...resorts];
  const dir = tableSort.dir === 'asc' ? 1 : -1;
  sorted.sort((a, b) => {
    let cmp;
    switch (state.sortBy) {
      case 'drive': {
        const da = getDriveMins(a.id) ?? 9999, db = getDriveMins(b.id) ?? 9999;
        cmp = da - db; break;
      }
      case 'price':       cmp = a.price      - b.price; break;
      case 'vertical':    cmp = b.vertical   - a.vertical; break;
      case 'trails':      cmp = b.trails     - a.trails; break;
      case 'avgSnowfall': cmp = b.avgSnowfall - a.avgSnowfall; break;
      case 'crowd':       cmp = crowdForecast(b).score - crowdForecast(a).score; break;
      case 'state':       cmp = a.state.localeCompare(b.state); break;
      case 'pass':        cmp = a.passGroup.localeCompare(b.passGroup); break;
      case 'name':
      default:            cmp = a.name.localeCompare(b.name); break;
    }
    return cmp * dir;
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
  const qualityScore = r => (r.avgSnowfall / 300) * 55 + (r.vertical / 3500) * 45;

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
  const count       = resorts.length;
  const avgVertical = count ? Math.round(resorts.reduce((s, r) => s + r.vertical, 0) / count) : 0;
  const avgPrice    = count ? Math.round(resorts.reduce((s, r) => s + r.price, 0) / count) : 0;

  els.summaryCards.innerHTML = [
    dbStatHtml('Mountains',   count,                                          'in New England'),
    dbStatHtml('Epic',        resorts.filter(r => r.passGroup === 'Epic').length,        'resorts'),
    dbStatHtml('Ikon',        resorts.filter(r => r.passGroup === 'Ikon').length,        'resorts'),
    dbStatHtml('Indy',        resorts.filter(r => r.passGroup === 'Indy').length,        'resorts'),
    dbStatHtml('Independent', resorts.filter(r => r.passGroup === 'Independent').length, 'resorts'),
    dbStatHtml('Avg Vertical', `${avgVertical} ft`,                           'across all mountains'),
    dbStatHtml('Avg Ticket',   `$${avgPrice}`,                                'day ticket est.'),
  ].join('');
}

function dbStatHtml(label, value, sub) {
  return `<div class="db-stat">
    <div class="db-stat-value">${value}</div>
    <div class="db-stat-label">${label}</div>
    ${sub ? `<div class="db-stat-sub">${sub}</div>` : ''}
  </div>`;
}

// ─── Card templates ───────────────────────────────────────────────────────────
function cardBreakdown(b) {
  const c = b.components;
  return `<div class="breakdown">
    <div>Snow quality: <strong>+${c.snow.toFixed(1)}</strong></div>
    <div>Drive time: <strong>+${c.drive.toFixed(1)}</strong></div>
    <div>Mountain size: <strong>+${c.size.toFixed(1)}</strong></div>
    <div>Skill match: <strong>+${c.skillMatch.toFixed(1)}</strong></div>
    <div>Value: <strong>+${c.value.toFixed(1)}</strong></div>
    <div>Crowd penalty: <strong>-${c.crowdPenalty.toFixed(1)}</strong></div>
  </div>`;
}
function crowdClass(label) { return `crowd-${label.toLowerCase()}`; }

// ─── Async render panels ──────────────────────────────────────────────────────
// Single shared pipeline — compute candidates & weather once, pass to all panels (audit #2)
async function renderAsyncPanels(resorts) {
  // plannerCandidates scopes weather fetching to the most relevant resorts —
  // we don't need live weather for all 120 mountains to build the panels.
  const candidates = plannerCandidates(resorts);
  await ensureWeather(candidates);

  // Render everything that needs forecast weather.
  // renderVerdict gets the full filtered "resorts" set — same pool as the table —
  // so the verdict #1 always matches the table #1.
  renderCompareTable(resorts);
  updateMap(resorts);
  renderDetail();
  renderVerdict(resorts);          // first pass — use full filtered set
  renderBestDay(resorts);
  _renderStorm(resorts);

  // Fetch last-7-days historical data in parallel — re-render when ready
  ensureHistory(candidates.slice(0, 50)).then(() => {
    renderVerdict(resorts);        // re-render with histTotal chips now populated
    renderBestDay(resorts);
    renderDetail();
    renderCompareTable(resorts);
  });
}



function _renderStorm(resorts) {
  // Use the full filtered pool — pick any resort that has weather cached.
  // Sort by 3-day storm total descending; show top 4.
  const enriched = resorts
    .map(resort => {
      const wx    = state.weatherCache[resort.id]?.data;
      const storm = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
      return { resort, wx, storm };
    })
    .filter(item => item.wx)               // only resorts with live weather
    .sort((a, b) => b.storm - a.storm)
    .slice(0, 4);

  if (!enriched.length) {
    els.stormGrid.innerHTML = '<div class="planner-card">Loading storm data — set a location or wait a moment for weather to load.</div>';
    return;
  }

  els.stormGrid.innerHTML = enriched.map((item, i) => {
    const days = (item.wx.forecast || []).map(f =>
      `<span class="metric-chip">❄️ ${f.day}: ${f.snow.toFixed(1)}"</span>`).join('');
    return `
    <div class="planner-card ${i === 0 ? 'top' : ''}">
      <div class="planner-title">${esc(item.resort.name)}</div>
      <div class="planner-meta">${esc(item.resort.state)} · ${esc(item.resort.passGroup)} · <strong>${item.storm.toFixed(1)}"</strong> over 3 days</div>
      ${days}
      <div class="metric-chip">🚗 ${formatDrive(item.resort.id)}</div>
    </div>`;
  }).join('');
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


// ─── Compare table ────────────────────────────────────────────────────────────
function renderCompareTable(resorts) {
  // Apply inline table search filter
  const q = (state.tableSearch || '').trim().toLowerCase();
  const filtered = q
    ? resorts.filter(r => `${r.name} ${r.state} ${r.passGroup} ${r.region}`.toLowerCase().includes(q))
    : resorts;

  // Schwartzian transform — compute breakdown once per resort (audit #6)
  const w = normalizedWeights();
  const decorated = filtered.map(resort => {
    const weather    = state.weatherCache[resort.id]?.data;
    const breakdown  = weather ? plannerScoreBreakdown(resort, weather, 0, w) : null;
    const stormTotal = weather ? (weather.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    const hist       = historyCache.get(resort.id);
    return { resort, weather, breakdown, stormTotal, hist };
  });

  const dir = tableSort.dir === 'asc' ? 1 : -1;
  if (state.sortBy === 'planner') {
    decorated.sort((a, b) => dir * ((a.breakdown?.score ?? -Infinity) - (b.breakdown?.score ?? -Infinity)));
  } else if (state.sortBy === 'storm') {
    decorated.sort((a, b) => dir * ((a.stormTotal ?? -1) - (b.stormTotal ?? -1)));
  } else if (state.sortBy === 'hist7day') {
    decorated.sort((a, b) => dir * ((a.hist?.total ?? -1) - (b.hist?.total ?? -1)));
  } else {
    const order = new Map(staticSort(resorts).map((r, i) => [r.id, i]));
    decorated.sort((a, b) => (order.get(a.resort.id) ?? 9999) - (order.get(b.resort.id) ?? 9999));
  }

  // Show top 10 by default; View All shows everything
  const showAll = state.tableViewAll || q;  // always show all rows when searching
  const displayed = showAll ? decorated : decorated.slice(0, 10);

  // Update result count + View All button
  const totalFiltered = filtered.length;
  if (q) {
    els.resultCount.textContent = `${displayed.length} result${displayed.length !== 1 ? 's' : ''} for "${q}"`;
  } else {
    els.resultCount.textContent = state.tableViewAll
      ? `All ${totalFiltered} mountains`
      : `Top 10 of ${totalFiltered} mountains`;
  }
  if (els.tableViewAllBtn) {
    els.tableViewAllBtn.textContent = (state.tableViewAll && !q) ? '⬆ Show Top 10' : `View All ${totalFiltered}`;
    els.tableViewAllBtn.style.display = q ? 'none' : '';
  }

  // Update sort indicators on column headers
  document.querySelectorAll('.sortable-th').forEach(th => {
    const ind = th.querySelector('.sort-indicator');
    if (!ind) return;
    if (th.dataset.sort === state.sortBy) {
      ind.textContent = tableSort.dir === 'asc' ? ' ▲' : ' ▼';
      th.classList.add('sort-active');
    } else {
      ind.textContent = '';
      th.classList.remove('sort-active');
    }
  });

  els.comparisonBody.innerHTML = displayed.map(({ resort, breakdown, stormTotal, hist }) => {
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
        <td>$${resort.price}</td>
        <td class="${crowdClass(crowd)}">${crowd}</td>
      </tr>`;
  }).join('');

  // Pass sorted list to passCalc so it reflects current sort order (audit #21)
  // Note: event listeners are wired once via delegation in wireEvents() — not attached here (audit #10)
  renderMobileCards(displayed);
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
    ['Avg snowfall',    r => `${r.avgSnowfall}"`],
    ['Day ticket*',     r => `$${r.price}`],
    ['Drive',           r => formatDrive(r.id)],
    ['Ski Score', r => { const wx = state.weatherCache[r.id]?.data; return wx ? plannerScoreBreakdown(r, wx, 0, w).score : '—'; }],
    ['Crowd',           r => crowdForecast(r).label],
    ['Base / summit',   r => `${r.baseElevation} / ${r.summitElevation} ft`],
  ];
  els.compareContent.innerHTML = `
    <div id="compareAiBox" class="compare-ai-box">
      <div class="ai-thinking">🤖 Loading AI recommendation…</div>
    </div>
    <div class="table-wrap">
      <table class="comparison-table">
        <thead><tr><th scope="col">Metric</th>${resorts.map(r => `<th scope="col">${esc(r.name)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, fn]) =>
          `<tr><td><strong>${label}</strong></td>${resorts.map(r => `<td>${fn(r)}</td>`).join('')}</tr>`
        ).join('')}</tbody>
      </table>
    </div>`;
  // AI recommendation — build prompt and call Claude API
  const aiBox = document.getElementById('compareAiBox');
  if (aiBox) {
    aiBox.innerHTML = '<div class="ai-thinking">🤖 Analyzing your mountains…</div>';
    // Build a clean payload for the server-side proxy — no API key on the client
    const payload = resorts.map(r => ({
      name:         r.name,
      state:        r.state,
      vertical:     r.vertical,
      trails:       r.trails,
      price:        r.price,
      avgSnowfall:  r.avgSnowfall,
      crowds:       crowdForecast(r).label,
      drive:        getDriveMins(r.id),
      passGroup:    r.passGroup,
      plannerScore: (() => { const wx = state.weatherCache[r.id]?.data; return wx ? plannerScoreBreakdown(r, wx, 0, w).score : null; })(),
    }));
    fetch('/api/recommend', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ resorts: payload }),
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      const text = data.recommendation || 'No recommendation returned.';
      aiBox.innerHTML = '<div class="ai-verdict-inner"><div class="ai-verdict-text">' + text.replace(/\n/g, '<br>') + '</div></div>';
    })
    .catch(err => { aiBox.innerHTML = '<div class="ai-thinking muted">AI recommendation unavailable — ' + err.message + '</div>'; });
  }

  els.comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail({ scroll = false } = {}) {
  const resort = RESORTS.find(r => r.id === state.selectedId);
  if (!resort) { els.detailSection.classList.add('hidden'); return; }
  els.detailSection.classList.remove('hidden');
  const wx      = state.weatherCache[resort.id]?.data;
  const w       = normalizedWeights();
  const skis    = wx ? skiScoreBreakdown(resort, wx, 0) : null;
  const crowd   = crowdForecast(resort);
  const tb      = resort.terrainBreakdown;

  els.detailCard.innerHTML = `
    <div class="section-header">
      <div>
        <div class="eyebrow">Selected Mountain</div>
        <h2>${esc(resort.name)}</h2>
        <p class="muted small">${esc(resort.state)} · ${esc(resort.passGroup)} · ${esc(resort.ownerGroup)}</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        ${resort.website ? `<a class="btn btn-primary detail-website-btn" href="${resort.website}" target="_blank" rel="noopener">&#127758; Visit Website &#8599;</a>` : ''}
        <div class="metric-chip">${skis ? `⭐ Ski Score ${skis.skiScore}` : 'Loading Ski Score…'}</div>
      </div>
    </div>
    <div class="metric-grid">
      <div class="metric-box"><div class="metric-label">Vertical</div><div class="metric-value">${resort.vertical} ft</div></div>
      <div class="metric-box"><div class="metric-label">Trails</div><div class="metric-value">${resort.trails}</div></div>
      <div class="metric-box"><div class="metric-label">Day Ticket*</div><div class="metric-value">$${resort.price}</div></div>
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
        <h3 style="margin:0 0 10px">⭐ Ski Score Breakdown</h3>
        ${skis ? `
        <div class="breakdown">
          <div>Snow quality: <strong>${skis.factors.snow}</strong></div>
          <div>Drive score: <strong>${skis.factors.drive}</strong></div>
          <div>Mountain size: <strong>${skis.factors.size}</strong></div>
          <div>Skill match: <strong>${skis.factors.skill}</strong></div>
          <div>Value: <strong>${skis.factors.value}</strong></div>
          <div>Crowd penalty: <strong>−${skis.factors.crowdPenalty}</strong></div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">Total Ski Score: <strong>${skis.skiScore}</strong></div>
        </div>` : '<div class="muted">Weather loading…</div>'}
      </div>
      <div class="sub-card">
        <h3 style="margin:0 0 10px">👥 Crowd Forecast</h3>
        <div class="breakdown">
          <div>Expected traffic: <strong>${crowd.label}</strong></div>
          <div>Confidence: <strong>${crowd.confidence}</strong></div>
          ${crowd.reasons.length ? `<div style="margin-top:6px">${crowd.reasons.map(r => `<div class="muted small">• ${esc(r)}</div>`).join('')}</div>` : ''}
        </div>
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
  if (scroll) els.detailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Update URL hash + document title for SEO / shareable deep-links (Priority 5)
  // Preserve any existing query params (preset, filters etc.) when adding the hash.
  if (resort) {
    const qp = location.search; // preserve ?preset=...&pass=... etc.
    history.replaceState(null, '', qp + '#resort-' + resort.id);
    document.title = resort.name + ' — SkiNE | New England Ski Decision Engine';
  }
}

// ─── Map ──────────────────────────────────────────────────────────────────────
let map = null, markers = {};

function passColor(g)  { return { Epic:'#2b6de9', Ikon:'#8a4dff', Indy:'#22b38a', Independent:'#90a4be' }[g] || '#90a4be'; }
function driveColor(m) { return m <= 90 ? '#22b38a' : m <= 150 ? '#8ccf57' : m <= 210 ? '#f0b44c' : '#e07a5f'; }
function stormColor(t) { return t >= 8 ? '#1d4ed8' : t >= 5 ? '#3b82f6' : t >= 2 ? '#93c5fd' : '#cbd5e1'; }
function verticalColor(v) {
  // 5 tiers by vertical drop
  if (v >= 2500) return '#1d2d6e'; // Navy  — big destination (Whiteface 3430, Killington 3050…)
  if (v >= 1800) return '#2b6de9'; // Blue  — large regional (Stowe, Loon, Cannon…)
  if (v >= 1200) return '#22b38a'; // Teal  — solid mid-size (Gunstock, Bretton, Jiminy…)
  if (v >= 700)  return '#f0b44c'; // Amber — smaller hill (Pats Peak, Whaleback…)
  return '#e07a5f';                // Coral — beginner / small (McIntyre, Bradford…)
}

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
    : state.mapMode === 'vertical' ? `
    <span class="legend-chip"><i class="legend-dot" style="background:#1d2d6e"></i> 2,500+ ft</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#2b6de9"></i> 1,800–2,499 ft</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> 1,200–1,799 ft</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#f0b44c"></i> 700–1,199 ft</span>
    <span class="legend-chip"><i class="legend-dot" style="background:#e07a5f"></i> under 700 ft</span>`
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
    if (state.mapMode === 'vertical') color = verticalColor(resort.vertical);
    const size = selected ? 16 : 10;
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,.18);opacity:${inFilter ? 1 : 0.22};box-shadow:${selected ? '0 0 0 4px rgba(43,109,233,.18)' : '0 2px 6px rgba(0,0,0,.18)'}"></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });
    if (markers[resort.id]) { markers[resort.id].setIcon(icon); return; }
    const marker = L.marker([resort.lat, resort.lon], { icon })
      .addTo(map)
      .bindPopup(`<strong>${esc(resort.name)}</strong><br>${esc(resort.state)} · ${esc(resort.passGroup)}<br>Vertical ${resort.vertical} ft<br>Ticket* $${resort.price}${resort.website ? `<br><a href="${resort.website}" target="_blank" rel="noopener">Visit website ↗</a>` : ''}`);
    marker.on('click', () => { state.selectedId = resort.id; renderDetail({ scroll: true }); });
    markers[resort.id] = marker;
  });
}

// ─── AI Natural Language Chat ─────────────────────────────────────────────────
// Calls /api/chat with user's free-text query + pre-ranked resort data.
// On success: highlights the matching resort in the table and scrolls to it.
async function askAI(query) {
  if (!query.trim() || aiChatLoading) return;
  aiChatLoading = true;

  if (els.aiChatBtn)   els.aiChatBtn.disabled = true;
  if (els.aiChatResult) {
    els.aiChatResult.className = 'ai-chat-result ai-chat-loading';
    els.aiChatResult.innerHTML = '<span class="ai-spinner"></span> Analyzing 120 mountains for you…';
  }

  // Build a compact payload: top 25 resorts with all available data
  const current = filteredResorts();
  const w = normalizedWeights();
  const payload = current.slice(0, 25).map(r => {
    const wx = state.weatherCache[r.id]?.data;
    const snow3d = wx ? (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    const bd = wx ? plannerScoreBreakdown(r, wx, 0, w) : null;
    return {
      id:           r.id,
      name:         r.name,
      state:        r.state,
      vertical:     r.vertical,
      trails:       r.trails,
      price:        r.price,
      passGroup:    r.passGroup,
      avgSnowfall:  r.avgSnowfall,
      drive:        getDriveMins(r.id),
      crowd:        crowdForecast(r).label,
      snow3d:       snow3d !== null ? Math.round(snow3d * 10) / 10 : null,
      plannerScore: bd ? bd.score : null,
      beginner:     r.terrainBreakdown?.beginner ?? null,
    };
  });

  try {
    const res  = await fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ query, resorts: payload }),
    });
    const data = await res.json();

    if (data.error || !data.resortName) throw new Error(data.error || 'No resort returned');

    // Find the matching resort by name (case-insensitive partial match)
    const nameLower = data.resortName.toLowerCase();
    const matched = RESORTS.find(r =>
      r.name.toLowerCase() === nameLower ||
      r.name.toLowerCase().includes(nameLower) ||
      nameLower.includes(r.name.toLowerCase())
    );

    const resortLink = matched
      ? `<button class="ai-result-jump-btn" data-resort-id="${matched.id}">&#128269; View ${esc(data.resortName)} in table</button>`
      : '';

    if (els.aiChatResult) {
      els.aiChatResult.className = 'ai-chat-result ai-chat-success';
      els.aiChatResult.innerHTML =
        `<div class="ai-result-header"><strong>&#129302; AI Pick: ${esc(data.resortName)}</strong></div>` +
        `<div class="ai-result-text">${esc(data.explanation)}</div>` +
        (resortLink ? `<div class="ai-result-actions">${resortLink}</div>` : '');
    }

    // Highlight the resort in the table — no page scroll, user is reading the AI result
    if (matched) {
      state.selectedId = matched.id;
      renderDetail();
      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${matched.id}"]`);
        if (row) {
          row.classList.add('ai-highlight');
          setTimeout(() => row.classList.remove('ai-highlight'), 2500);
        }
      }, 300);
    }

  } catch (err) {
    if (els.aiChatResult) {
      els.aiChatResult.className = 'ai-chat-result ai-chat-error';
      els.aiChatResult.innerHTML =
        `<span>&#9888;&#65039; ${esc(err.message || 'AI unavailable — try again shortly')}</span>`;
    }
  } finally {
    aiChatLoading = false;
    if (els.aiChatBtn) els.aiChatBtn.disabled = false;
  }
}

// ─── Best Day To Go ───────────────────────────────────────────────────────────
// Shows the 3-day forecast breakdown for the top 3 resorts and highlights the
// highest-quality day at each (based on snow + cold temperature scoring).
function renderBestDay(resorts) {
  if (!els.bestDaySection || !els.bestDayGrid) return;

  const withWx = resorts.filter(r => state.weatherCache[r.id]?.data);
  if (!withWx.length) {
    els.bestDaySection.classList.add('hidden');
    return;
  }

  const w    = normalizedWeights();
  const top3 = withWx
    .map(r => ({
      resort: r,
      wx:     state.weatherCache[r.id].data,
      bd:     plannerScoreBreakdown(r, state.weatherCache[r.id].data, 0, w),
    }))
    .sort((a, b) => b.bd.score - a.bd.score)
    .slice(0, 3);

  if (!top3.length) { els.bestDaySection.classList.add('hidden'); return; }

  els.bestDaySection.classList.remove('hidden');
  if (els.bestDayLastUpdated) {
    els.bestDayLastUpdated.textContent = 'Updated ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  els.bestDayGrid.innerHTML = top3.map(({ resort, wx, bd }) => {
    const forecast = wx.forecast || [];
    if (!forecast.length) return '';

    // Score each day: snow is king, cold temps add quality bonus
    const dayScores = forecast.map(f => {
      let s = Math.min(50, f.snow * 8);                              // snow: up to 50pts
      if (f.lo <= 24) s += 15; else if (f.lo <= 30) s += 8;        // powder cold bonus
      if (f.hi <= 32) s += 8;  else if (f.hi <= 38) s += 4;        // cold hi bonus
      if (f.hi > 45)  s -= 10;                                       // warm/slushy penalty
      return { ...f, dayScore: s };
    });
    const bestIdx = dayScores.reduce((bi, d, i) => d.dayScore > dayScores[bi].dayScore ? i : bi, 0);

    const drive = formatDrive(resort.id);

    return `<div class="best-day-card${bd.score > 0 ? '' : ''}">
      <div class="best-day-resort-row">
        <div>
          <div class="best-day-resort">${esc(resort.name)}</div>
          <div class="best-day-meta">${esc(resort.state)} &middot; ${esc(resort.passGroup)} &middot; Score ${bd.score}</div>
        </div>
        ${drive !== '—' ? `<div class="best-day-drive"><span class="metric-chip">&#128664; ${drive}</span></div>` : ''}
      </div>
      <div class="best-day-days">
        ${dayScores.map((f, i) => `
          <div class="best-day-day${i === bestIdx ? ' best' : ''}">
            ${i === bestIdx ? '<div class="bdd-best-badge">&#9733; Best</div>' : ''}
            <div class="bdd-day-name">${f.day}</div>
            <div class="bdd-snow">${f.snow > 0 ? '&#10052;&#65039; ' + f.snow.toFixed(1) + '"' : '<span class="bdd-no-snow">No snow</span>'}</div>
            <div class="bdd-temps">${f.lo}&deg;&ndash;${f.hi}&deg;F</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }).join('');
}

// ─── Mobile Card Grid ─────────────────────────────────────────────────────────
// Renders a compact card grid for mobile screens (< 760px).
// Called from renderCompareTable with the same already-decorated array.
function renderMobileCards(decorated) {
  if (!els.mobileCardGrid) return;
  const items = decorated.slice(0, state.tableViewAll ? decorated.length : 10);
  els.mobileCardGrid.innerHTML = items.map(({ resort, breakdown, stormTotal }) => {
    const score  = breakdown ? breakdown.score : null;
    const storm  = stormTotal !== null ? stormTotal.toFixed(1) + '"' : '…';
    const drive  = formatDrive(resort.id);
    const crowd  = crowdForecast(resort).label;
    const passColors = { Epic:'#1a4fa8', Ikon:'#c8a84b', Indy:'#2d7a3a', Independent:'#6b5e7a' };
    const passColor  = passColors[resort.passGroup] || '#90a4be';
    const isSelected = resort.id === state.selectedId;
    return `<div class="mob-card${isSelected ? ' mob-card-selected' : ''}" data-mob-id="${resort.id}" role="button" tabindex="0" aria-label="${esc(resort.name)}">
      <div class="mob-card-top">
        <div class="mob-card-name">${esc(resort.name)}</div>
        ${score !== null ? `<div class="mob-card-score" title="Ski Score">⭐ ${score}</div>` : ''}
      </div>
      <div class="mob-card-chips">
        <span class="mob-chip" style="background:${passColor}22;color:${passColor};border-color:${passColor}44">${esc(resort.passGroup)}</span>
        <span class="mob-chip">${esc(resort.state)}</span>
        ${drive !== '—' ? `<span class="mob-chip">&#128664; ${drive}</span>` : ''}
        <span class="mob-chip">&#10052;&#65039; ${storm}</span>
      </div>
      <div class="mob-card-stats">
        <div><span class="mob-stat-label">Vertical</span><span class="mob-stat-val">${resort.vertical} ft</span></div>
        <div><span class="mob-stat-label">Trails</span><span class="mob-stat-val">${resort.trails}</span></div>
        <div><span class="mob-stat-label">Ticket</span><span class="mob-stat-val">$${resort.price}</span></div>
        <div><span class="mob-stat-label">Crowd</span><span class="mob-stat-val ${crowdClass(crowd)}">${crowd}</span></div>
      </div>
      <div class="mob-card-footer">
        <label class="mob-compare-label">
          <input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} />
          Compare
        </label>
        <div style="display:flex;gap:6px">
          ${resort.website ? `<a class="mob-website-btn" href="${resort.website}" target="_blank" rel="noopener">&#127758;</a>` : ''}
          <button class="mob-card-detail-btn" data-mob-detail="${resort.id}">Details &rarr;</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── Enhanced Share (Priority 6) ─────────────────────────────────────────────
// Uses Web Share API on mobile; falls back to clipboard copy on desktop.
// Produces a richer text than the plain URL share.
function shareVerdict(resort, verdictData) {
  const { stormTotal, driveText } = verdictData;
  const snowText  = stormTotal > 0 ? `${stormTotal.toFixed(1)}" forecast` : 'solid groomed conditions';
  const driveInfo = driveText ? ` · ${driveText} drive` : '';
  const shareText =
    `I'm skiing ${resort.name} (${resort.state}) this weekend — ${snowText}${driveInfo}. ` +
    `Pass: ${resort.passGroup}. Find your mountain →`;
  const p   = serializeState();
  const url = `${location.origin}${location.pathname}${p.toString() ? '?' + p : ''}`;

  if (navigator.share) {
    navigator.share({
      title: `Ski day at ${resort.name} — SkiNE`,
      text:  shareText,
      url,
    }).catch(() => {}); // user cancelled — silent
  } else {
    const full = `${shareText} ${url}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(full)
        .then(() => showToast('🎿 Ski plan copied — share it with your crew!', 3200))
        .catch(() => fallbackCopy(full));
    } else {
      fallbackCopy(full);
    }
  }
}

// ─── Top-level render ─────────────────────────────────────────────────────────
function renderAllCards(resorts) {
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderHiddenGems(resorts);
  renderCompareTable(resorts);
  renderCompareTray();
  renderDetail();
  updateMap(resorts);
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));

  // If weather is already cached, re-render immediately so weight slider changes
  // take effect instantly without hiding the verdict or showing loading placeholders.
  const candidates = plannerCandidates(resorts);
  const hasWeather = resorts.some(r => state.weatherCache[r.id]?.data);

  if (hasWeather) {
    // Pass full filtered resorts to verdict so its #1 = table #1
    renderVerdict(resorts);
    renderBestDay(resorts);
    _renderStorm(resorts);
  } else {
    // First load — show placeholders until the async fetch completes
    if (els.verdictSection)  els.verdictSection.classList.add('hidden');
    if (els.bestDaySection)  els.bestDaySection.classList.add('hidden');
    els.stormGrid.innerHTML = '<div class="planner-card">Loading storm data…</div>';
  }

  // Always run async pipeline to catch any missing weather/history and stay fresh
  renderAsyncPanels(resorts);
}

function render() {
  renderAllCards(filteredResorts());
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
const debouncedRender = debounce(render, 50);

function wireEvents() {
  // ── AI Chat ──────────────────────────────────────────────────────────────────
  if (els.aiChatBtn) {
    els.aiChatBtn.addEventListener('click', () => {
      const q = els.aiChatInput?.value?.trim();
      if (q) askAI(q);
    });
  }
  if (els.aiChatInput) {
    els.aiChatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = els.aiChatInput.value?.trim();
        if (q) askAI(q);
      }
    });
  }
  // Jump-to-resort button rendered inside AI result
  if (els.aiChatResult) {
    els.aiChatResult.addEventListener('click', e => {
      const btn = e.target.closest('[data-resort-id]');
      if (!btn) return;
      const id = btn.dataset.resortId;
      state.selectedId = id;
      renderDetail(); // no scroll — we're scrolling to the table row below
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else {
        const sec = document.getElementById('compareSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ── Mobile card grid delegation ───────────────────────────────────────────
  if (els.mobileCardGrid) {
    els.mobileCardGrid.addEventListener('click', e => {
      // Detail button
      const detailBtn = e.target.closest('[data-mob-detail]');
      if (detailBtn) {
        state.selectedId = detailBtn.dataset.mobDetail;
        renderDetail({ scroll: true });
        return;
      }
      // Card tap (not checkbox, not button)
      const card = e.target.closest('.mob-card[data-mob-id]');
      if (!card || e.target.closest('input') || e.target.closest('button')) return;
      state.selectedId = card.dataset.mobId;
      renderDetail({ scroll: true });
    });
    els.mobileCardGrid.addEventListener('change', e => {
      const box = e.target.closest('input[data-compare]');
      if (!box) return;
      if (box.checked) state.compareSet.add(box.dataset.compare);
      else             state.compareSet.delete(box.dataset.compare);
      renderCompareTray();
    });
  }

  // ── Sortable column headers ─────────────────────────────────────────────
  document.querySelectorAll('.sortable-th').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (state.sortBy === col) {
        tableSort.dir = tableSort.dir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortBy = col;
        tableSort.col = col;
        // Default direction: ascending for price/drive/name/state/pass, descending for others
        tableSort.dir = ['price','drive','name','state','pass'].includes(col) ? 'asc' : 'desc';
        if (els.sortBy && [...els.sortBy.options].some(o => o.value === col)) {
          els.sortBy.value = col;
        }
      }
      pushUrlDebounced();
      render();
    });
  });

  els.passFilter.addEventListener('change',     e => { state.passFilter  = e.target.value; pushUrlDebounced(); render(); });
  els.stateFilter.addEventListener('change',    e => { state.stateFilter = e.target.value; pushUrlDebounced(); render(); });
  els.maxDriveFilter.addEventListener('change', e => {
    state.maxDrive = Number(e.target.value);
    if (state.maxDrive > 0 && !state.origin) showToast('Set a starting location to use the Drive Time filter');
    pushUrlDebounced(); render();
  });
  els.sortBy.addEventListener('change', e => { state.sortBy = e.target.value; pushUrlDebounced(); render(); });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    pushUrlDebounced(); render();
  });
  if (els.toggleDaytrip) els.toggleDaytrip.addEventListener('click', () => {
    state.daytripOnly = !state.daytripOnly;
    els.toggleDaytrip.setAttribute('aria-pressed', String(state.daytripOnly));
    savePlannerState();
    pushUrlDebounced();
    debouncedRender();
  });

  // Planner collapse/expand toggle
  if (els.plannerToggle && els.plannerDetails) {
    // Start expanded (details visible by default)
    els.plannerToggle.setAttribute('aria-expanded', 'true');
    els.plannerDetails.hidden = false;
    els.plannerSection && els.plannerSection.classList.remove('planner-collapsed');

    els.plannerToggle.addEventListener('click', () => {
      const isExpanded = els.plannerToggle.getAttribute('aria-expanded') === 'true';
      const opening = !isExpanded;
      els.plannerToggle.setAttribute('aria-expanded', String(opening));
      els.plannerDetails.hidden = !opening;
      els.plannerSection && els.plannerSection.classList.toggle('planner-collapsed', !opening);
      const lbl = els.plannerToggle.querySelector('.planner-toggle-label');
      if (lbl) lbl.textContent = opening ? 'Customize Your Settings' : 'Customize Your Settings';
    });
  }

  // In-planner Daytrip toggle (mirrors toolbar toggleDaytrip)
  function syncPlannerDaytripBtn() {
    const btn = document.getElementById('plannerDaytripToggle');
    if (!btn) return;
    btn.textContent = state.daytripOnly ? '✅ On' : 'Off';
    btn.classList.toggle('active', state.daytripOnly);
  }
  const plannerDtBtn = document.getElementById('plannerDaytripToggle');
  if (plannerDtBtn) {
    plannerDtBtn.addEventListener('click', () => {
      state.daytripOnly = !state.daytripOnly;
      if (els.toggleDaytrip) els.toggleDaytrip.setAttribute('aria-pressed', String(state.daytripOnly));
      syncPlannerDaytripBtn();
      savePlannerState();
      pushUrlDebounced();
      debouncedRender();
    });
    syncPlannerDaytripBtn();
  }

  // Sticky nav: highlight active section on scroll
  (function initNavHighlight() {
    const sectionIds = ['searchSection','plannerSection','verdictSection','compareSection','stormSection','mapSection'];
    const navLinks   = document.querySelectorAll('.top-nav a[href^="#"]');
    function onScroll() {
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 80) current = id;
      }
      navLinks.forEach(a => {
        const target = a.getAttribute('href').slice(1);
        a.classList.toggle('nav-active', target === current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();
  els.resetFilters.addEventListener('click', () => {
    state.search = ''; state.passFilter = 'All'; state.stateFilter = 'All';
    state.sortBy = 'planner'; state.nightOnly = false; state.daytripOnly = false; state.maxDrive = 0;
    state.skillLevel = 'mixed'; state.passPreference = 'any'; state.tableSearch = ''; state.tableViewAll = false;
    tableSort = { col: 'planner', dir: 'desc' };
    els.passFilter.value     = 'All';
    els.stateFilter.value    = 'All';
    els.maxDriveFilter.value = '0';
    els.sortBy.value         = 'planner';
    els.toggleNight.setAttribute('aria-pressed', 'false');
    if (els.toggleDaytrip) els.toggleDaytrip.setAttribute('aria-pressed', 'false');
    if (els.tableSearch) els.tableSearch.value = '';
    pushUrlDebounced(); render();
  });

  // Table inline search
  if (els.tableSearch) {
    els.tableSearch.addEventListener('input', e => {
      state.tableSearch = e.target.value;
      state.tableViewAll = false;
      renderCompareTable(filteredResorts());
    });
  }

  // View All / Show Top 10 toggle
  if (els.tableViewAllBtn) {
    els.tableViewAllBtn.addEventListener('click', () => {
      state.tableViewAll = !state.tableViewAll;
      renderCompareTable(filteredResorts());
    });
  }

  els.compareBtn.addEventListener('click', renderComparePanel);
  els.clearCompare.addEventListener('click', () => {
    state.compareSet.clear();
    els.comparePanel.classList.add('hidden');
    renderCompareTray();
    render();
  });
  els.closeCompare.addEventListener('click', () => els.comparePanel.classList.add('hidden'));

  // Weight sliders — sync UI instantly, debounce the expensive render
  [['snow','snowWeight'],['drive','driveWeight'],
   ['size','sizeWeight'],['value','valueWeight'],['crowd','crowdWeight']].forEach(([key, id]) => {
    if (!els[id]) return;
    els[id].addEventListener('input', e => {
      state.weights[key] = Number(e.target.value);
      state.preset = 'custom';
      savePlannerState();
      syncPlannerControls();
      pushUrlDebounced();
      debouncedRender();
    });
  });

  // Skill level buttons
  document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.skillLevel = btn.dataset.skill;
      state.preset = 'custom';
      savePlannerState();
      syncPlannerControls();
      pushUrlDebounced();
      debouncedRender();
    });
  });

  // Pass preference buttons
  document.querySelectorAll('.pass-pref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.passPreference = btn.dataset.pass;
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
  // ── Event delegation for compare table and pills (audit #10) ──────────────
  els.comparisonBody.addEventListener('click', e => {
    const row = e.target.closest('tr[data-id]');
    if (!row || e.target.closest('input')) return;
    state.selectedId = row.dataset.id;
    renderDetail({ scroll: true });
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
    if (els.toggleDaytrip) els.toggleDaytrip.setAttribute('aria-pressed', String(state.daytripOnly));
  }

  syncPlannerControls();
  wireEvents();
  render();

  // If origin was restored from URL, kick off drive time loading
  if (hadUrlState && state.origin) {
    applyHaversineEstimates();
    loadDriveTimes();
  }

  // Hash-based routing — restore selected resort from URL hash (#resort-<id>)
  // This enables shareable deep-links to individual resort detail cards (Priority 5).
  const hash = window.location.hash;
  const hashMatch = hash.match(/^#resort-(.+)$/);
  if (hashMatch) {
    const resortId = hashMatch[1];
    const found = RESORTS.find(r => r.id === resortId);
    if (found) {
      state.selectedId = resortId;
      document.title = found.name + ' — SkiNE | New England Ski Decision Engine';
      // Scroll to detail section after render completes
      setTimeout(() => {
        renderDetail();
        const sec = document.getElementById('detailSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }

  setTimeout(() => initMap(), 100);
}

initialize();
