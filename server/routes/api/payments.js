var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");

var iamport = require("../../config/iamport");

const { sequelize, purchase, payments, Sequelize: {Op} } = require("../../models");

const { Iamporter, IamporterError } = require('iamporter');
const iamporter = new Iamporter({
    apiKey: iamport.apikey,
    secret: iamport.secret,
});

router.post('/', isLoggedIn, async(req, res, next) => {
    try {
        var data = req.body

        const impData = async iamporter.findByImpUid(data.imp_uid);
        var impUid = impData.data.imp_uid;
        if (data.imp_uid !== impUid || (Number(data.paid_amount) !== Number(impData.data.amount))) {
            return res.json({status: 'error', reason: "IMPUID_NOT_MATCH"})
        }

        const existUid = await payment.findOne({
            where: {
                id: existUid
            }
        });

        if (existUid.length !== 0) {
            return res.json({status: 'error', reason: "IMPUID_EXIST"})
        }

        const new_payment = await payment.create({
            # TODO
        })


    }
    catch(err) {
        res.json({ status: 'error' });
    }
})
