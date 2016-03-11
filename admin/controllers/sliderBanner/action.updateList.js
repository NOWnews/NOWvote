import co from 'co';
import Promise from 'bluebird';
import _ from 'lodash';
import models from '../../../models';


const debug = require('debug')('NOWvote:admin:controllers:menuCategory:action.updateList');

module.exports = function(req, res, next) {

    let data = req.body;
    console.log(data);
    co(function*() {
        let weightList = data.weightList.split(',');
        let statusList = _.isArray(data['status[]']) ? data['status[]'] : [data['status[]']];

        let sliderBanners = yield models.sliderBanner.find()
            .where('trashed').equals(false)
            .execAsync();

        let updateSliderBannerList = yield Promise.map(sliderBanners, function(bannerItem) {
            let index = _.indexOf(weightList, String(bannerItem.sn));

            bannerItem.weight = index === -1 ? bannerItem.weight: index;

            if(_.indexOf(statusList, String(bannerItem.sn)) !== -1){
                bannerItem.set('status', true);
                return bannerItem.saveAsync();
            }else{
                bannerItem.set('status', false);
                return bannerItem.saveAsync();

            }
        });
        debug('updateSliderBannerList', updateSliderBannerList);


        return res.status(204).send();
    })
    .catch(next);

};
