const User = require('../../model/User');
const chalk = require('chalk');
const bcrypt = require("bcrypt");
exports.getAllUser = (req, res) => {
    User.find({}).then(
        (user) => {
            if(user) {
                return res.status(200).json(user);
            } else {
                return res.status(200).json('');
            }
        },
        error => {
            return res.status(201).json({message: error})
        }
    ).catch(
        error => {
            return res.status(201).json({message: error})
        }
    )
}
exports.changeStatusUser = (req, res) => {
    const id = req.body.id;
    const status = req.body.status;
    if (status == 'activated') {
        User.findByIdAndUpdate(id, { status: 'deactivated'}).then(
            res => {
                return res.status(200).json({message: 'Status changed successfully'})
            },
            error => {
                return res.status(400).json({message: error})
            }
        ).catch(
            error => {
                return res.status(400).json({message: error})
            }
        )
    } else if(status == 'deactivated') {
        User.findByIdAndUpdate(id, { status: 'activated'}).then(
            res => {
                return res.status(200).json({message: 'Status changed successfully'})
            },
            error => {
                return res.status(400).json({message: error})
            }
        ).catch(
            error => {
                return res.status(400).json({message: error})
            }
        )
    }
}

exports.removeUser = (req, res) => {
    const id = req.body.id;
    User.deleteOne({ _id: id}).then(
        res => {
            return res.status(200).json({message: 'The Item successfully deleted'})
        },
        err => {
            return res.status(400).json({message: err})
        }
    ).catch(
        error => {
            return res.status(400).json({message: error})
        }
    )
}

exports.multipleDeleteUser = (req, res) => {
    let list = req.body.list;
    console.log(chalk.cyan(list))
    User.deleteMany({_id: {$in: list }},
        function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
}

exports.getUserById = (req, res) => {
    const id = req.params.id;
    console.log(chalk.bgCyanBright(id));
    User.findOne({_id: id}).then(
        (user) => {
            console.log(chalk.green(user));
            return res.status(200).json(user);
        }
    ).catch((error) => {
        return res.status(404).json(error);
    })
}

exports.updateUser = async (req, res) => {
    let userID = req.body.userID;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let role = req.body.role;
    let password = '';
    let status = req.body.status;
    let location = req.body.location;
    await bcrypt.hash(req.body.password, 8).then(
        res => {
            password = res;
        }
    );
    User.findById(userID).then(
        (user) => {
            User.findOneAndUpdate({ _id: userID }, { firstname: firstname, lastname: lastname, email: email, password: password, role: role, status: status, locations: location})
            .then(
                user => {
                    if(user) {
                        return res.status(200).json({message: 'Status changed successfully'});
                    }
                }
            )
            .catch(
                error => {
                    return res.status(400).json({message: error});
                }
            )
        }
    ).catch(
        (error) => {
            return res.status(404).json({error: error});
        }
    )
}