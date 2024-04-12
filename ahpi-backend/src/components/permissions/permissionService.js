const Permission = require("roles-and-permission-node/model/Permission");
const PermissionRole = require("roles-and-permission-node/model/RolesPermission");
const Role = require("../roles/roleModel");
const User = require('../user/userModel')

const getPermissionService = async (id) => {
  try {
    let permissions = await Permission.find().lean();
    const allPermissions = await Promise.all(
      _.map(permissions, async (permission) => {
        const permissionRole = await PermissionRole.findOne({
          roleId: id,
          permissionId: permission._id,
        });
        const permissions = await PermissionRole.findOne({
          permissionId: permission._id,
        });
        let obj = {}
        if (permissions) {
          obj = {
            ..._.pick(permission, ["_id", "route_name", "module"]),
            canDel: permissions.hasOwnProperty("canDel")
              ? permissions["canDel"]
              : true,
            selected: !_.isEmpty(permissionRole),
          }
          }else{
            obj = {
            ..._.pick(permission, ["_id", "route_name", "module"]),
            canDel:false,
            selected: !_.isEmpty(permissionRole),
            }
          }
          obj.module = permission.route_name.split(".").slice(-2)[0];
          obj.route_name = permission.route_name.split(".").pop();
          return obj;
      })
    );
    return _.groupBy(allPermissions.filter(item => item), "module");
  } catch (error) {
    logger.error("Error - getPermissionService", error);
    throw new Error(error.message);
  }
};

const getUserPermission = async (id) => {
  try {
      let user = await User.findOne({_id: id});
      if (user) {
          const roles = await Role.find({_id: {'$in': user.roles[0].roleId}});
          const permissionRoles = await PermissionRole.find({roleId: {'$in': roles.map(role => role._id)}}).select('permissionId');
          const permissionRoleIds = permissionRoles.map(permission => permission.permissionId);
          let permissions = await Permission.find({_id: {'$in': permissionRoleIds}}).select(['route_name', 'module']);
          permissions.map((getPermission) => { getPermission.module = getPermission.route_name.split('.').at(-2)})
          permissions = _.groupBy(permissions, 'module');
          const rolePermissions = {};
          Object.keys(permissions).map((objectKey) => {
              rolePermissions[objectKey] = permissions[objectKey].map(a => a.route_name.split(".").pop());
          });
          rolePermissions.role = roles.map(a => a.code);
          return rolePermissions;
      } else {
          return false;
      }
  } catch (error) {
      logger.error("Error - gettingrolepermission", error);
      throw new Error(error.message);
  }
};

const updatePermissionService = async (roleId, permissionIds) => {
  try {
    let role = await Role.findOne({ _id: roleId });
    if (role) {
      await PermissionRole.deleteMany({
        roleId: roleId,
        canDel: true,
      });
      await Promise.all(
        _.map(permissionIds, async (permissionId) => {
          let permission = await Permission.findOne({ _id: permissionId });
          if (permission) {
            let data = {
              permissionId: permissionId,
              roleId: roleId,
            };
            await PermissionRole.create(data);
          }
        })
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("Error - updatingrolepermission", error);
    throw new Error(error.message);
  }
};

const permit = async (req) => {
  if (req.route.hasOwnProperty('o')) {
      const permission = await Permission.findOne({route_name: req.route['o']});
      if (!permission) {
          return true;
      }
      let permissionExist = null;

      if (!req.role) {
          throw new Error('Please provide role ids in request object');
      }
      permissionExist = await PermissionRole.countDocuments({
          permissionId: permission.id,
          roleId: req.role
      });

      return permissionExist;
  } else {
      return true;
  }
};

module.exports = {
  getPermissionService,
  updatePermissionService,
  getUserPermission,
  permit
};
