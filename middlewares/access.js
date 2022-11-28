const { Role, Module, Access } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');

module.exports = (moduleName, readAccess = false, writeAccess = false) => {
    return async(req, res, next) => {
        const { role } = req.user;

        // check the if there's role in the user payload
        if (!role) { return res.status(401).json({
                status: false,
                message: 'You are not authorized!',
                data: null
            });
        }

        // raw query string
        const getAllAccessesRoles = `
                select
                    r.name as role_name,
                    m.name as module_name,
                    a.read as read_access,
                    a.write as write_access
                from "Accesses" a
                join "Roles" r on
                    a.role_id = r.id
                join "Modules" m on
                    a.module_id = m.id
                where r.id = ? and m.name = ?
                `

        // query the data using the raw query
        var query = await db.sequelize.query(getAllAccessesRoles, {
            replacements: [JSON.stringify(role), moduleName],
            type: QueryTypes.SELECT
        });

        // check the module name
        if(query[0].module_name != moduleName) {
            return res.status(401).json({
                status: false,
                message: 'You are not authorized!',
                data: null
            });
        }

        // check the read access
        if(query[0].read_access != readAccess) {
            return res.status(401).json({
                status: false,
                message: 'You are not authorized!',
                data: null
            });
        }

        // check the write access
        if(query[0].write_access != writeAccess) {
            return res.status(401).json({
                status: false,
                message: 'You are not authorized!',
                data: null
            });
        }

        next();
    }
}
