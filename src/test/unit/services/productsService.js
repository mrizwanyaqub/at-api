'use strict';

(function () {
  const data = {
    get: async function get() {}
  };
  const ctx = {
    partner: {
      apis: {
        products: '/products/'
      }
    }
  };

  const products = [{
    "productId": 231314,
    "name": "Blue Crocodile My Sweet Box Baby Tote Bag",
    "description": "<p>S'uvimol's My Sweet Box Bag will be an exquisite addition to any accessory collection. The compact design is expertly crafted from exotic crocodile and features an internal magnetic fastening, while the scarf-wrapped top handle adds a refined touch. It's sized for small on-the-go essentials and comes with a detachable shoulder strap for carrying versatility. Style with neutral separates for maximum impact.</p>",
    "price": 9900,
    "minPrice": 9900,
    "color": "Blue",
    "availableColors": [
      "Blue",
      "Red",
      "Green",
      "Black"
    ],
    "media": [
      {
        "position": 1,
        "mediaType": "image",
        "src": "/2/1/211875906_blue_in.jpg?1542105195.342",
        "videoUrl": null
      },
      {
        "position": 2,
        "mediaType": "image",
        "src": "/2/1/211875906_blue_fr.jpg?1542105195.342",
        "videoUrl": null
      },
      {
        "position": 3,
        "mediaType": "image",
        "src": "/2/1/211875906_blue_bk.jpg?1542105195.342",
        "videoUrl": null
      },
      {
        "position": 4,
        "mediaType": "image",
        "src": "/2/1/211875906_blue_cu.jpg?1542105195.342",
        "videoUrl": null
      }
    ],
    "image": "/2/1/211875906_blue_in.jpg?1542105195.342",
    "smallImage": "/2/1/211875906_blue_in.jpg?1542105195.342",
    "thumbnail": "/2/1/211875906_blue_in.jpg?1542105195.342",
    "isInStock": false,
    "stockOfAllOptions": {
      "homeDeliveryQty": 0,
      "clickAndCollectQty": 0
    }
  }];
  const productsService = require('../../../services/productsService')({data});

  let dataGet;
  describe('Testing Products Service', function () {
    beforeEach(() => {
      dataGet = sinon.stub(data, 'get');
    });

    afterEach(() => {
      sinon.restore();
    });

    describe('Get Products', function () {
      describe('params validations', function () {
        it('Should throw exception--because ctx is not provided', async function () {
          try {
            await productsService.getProducts();
          } catch (e) {
            expect(e.message).to.equal('No ctx or invalid ctx object provided');
          }
        });
        it('Should throw exception--because color is not provided', async function () {
          try {
            await productsService.getProducts(ctx);
          } catch (e) {
            expect(e.message).to.equal('No color provided');
          }
        });
      });

      it('Should return colors', async function () {
        try {
          dataGet.returns(Promise.resolve(products));
          let productsResp = await productsService.getProducts(ctx, 'Red');
          expect(productsResp.length).to.equal(products.length);
          for(let i = 0; i < productsResp.length; i++) {
            expect(productsResp[i].name).to.equal(products[i].name);
            expect(productsResp[i].color).to.equal(products[i].color);
          }
        } catch (e) {
          expect(e).not.to.exist();
        }
      });
    });
  });
})();