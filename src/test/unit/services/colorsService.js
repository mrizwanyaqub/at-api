'use strict';

(function () {
  const data = {
    get: async function get() {}
  };
  const ctx = {
    partner: {
      apis: {
        colors: '/colors/'
      }
    }
  };
  const colorsObj = {
    red: 'red',
    black: '#000',
    white: '#fff'
  };
  const colorsArray = [
    {
      color: 'red',
      code: 'red'
    },
    {
      color: 'black',
      code: '#000'
    },
    {
      color: 'white',
      code: '#fff'
    }
  ];
  const colorsService = require('../../../services/colorsService')({data});

  let dataGet;
  describe('Testing Colors Service', function () {
    beforeEach(() => {
      dataGet = sinon.stub(data, 'get');
    });

    afterEach(() => {
      sinon.restore();
    });

    describe('Get Colors', function () {
      describe('params validations', function () {
        it('Should throw exception--because ctx is not provided', async function () {
          try {
            await colorsService.getColors();
          } catch (e) {
            expect(e.message).to.equal('No ctx or invalid ctx object provided');
          }
        });
      });

      describe('should get colors', function () {
        it('Should return colors', async function () {
          try {
            dataGet.returns(Promise.resolve(colorsObj));
            let colorsResp = await colorsService.getColors(ctx);
            expect(colorsResp.length).to.equal(colorsArray.length);
            for(let i = 0; i < colorsArray.length; i++) {
              expect(colorsResp[i].color).to.equal(colorsArray[i].color);
              expect(colorsResp[i].code).to.equal(colorsArray[i].code);
            }
          } catch (e) {
            expect(e).not.to.exist();
          }
        });
      });
    });
  });
})();