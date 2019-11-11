const models = require('../models');

const Tens = models.Tens;

const makerPage = (req, res) => {
    Tens.TensModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: "An error occurred" });
        }
        return res.render('app', { csrfToken: req.csrfToken(), Tens: docs });
    });  
}

const makeTens = (req, res) =>{
    let split = req.body.name.split(',');
    let allUserData = [];
    if(!split.length === 10) {
        return res.status(400).json({ error: "10 names required" });
    }
    for(let i = 0; i < split.length; i++)
    {
        const TensData = {
            name: req.body.name,
            owner: req.session.account._id,
        };
    
        const newTens = new Tens.TensModel(TensData);
    
        const TensPromise = newTens.save();
        //TensPromise.then(() => res.json({ redirect: '/maker' }));
        TensPromise.catch((err) => {
            console.log(err);
            if(err.code === 11000)
            {
                return res.status(400).json({ error: "Tens already exists" });
            }
    
            return res.status(400).json({ error: "An error occurred" });
        });
        allUserData[i] = TensPromise;
    }
    return allUserData;
};

module.exports.makerPage = makerPage;
module.exports.make = makeTens;