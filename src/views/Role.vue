<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="menuName">
          <el-input v-model="queryForm.roleName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" hide-required-asterisk prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="hanndleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="新增角色" v-model="showModal">
        <el-form
          ref="dialogForm"
          :model="roleForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="角色名称" hide-required-asterisk prop="roleName">
            <el-input
              v-model="roleForm.roleName"
              placeholder="请输入角色名称"
            />
          </el-form-item>
          <el-form-item label="备注" hide-required-asterisk prop="remark">
            <el-input v-model="roleForm.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="success" @click="handleSubmit"
            >确定</el-button
          ></template
        >
      </el-dialog>
      <!-- 权限弹框 -->
      <el-dialog title="权限设置" v-model="showPermission">
        <el-form label-width="120px">
          <el-form-item label="角色名称" hide-required-asterisk prop="roleName">
            {{ curRoleName }}
          </el-form-item>
          <el-form-item label="选择权限" hide-required-asterisk>
            <el-tree
              ref="tree"
              :data="menuList"
              show-checkbox
              node-key="_id"
              default-expand-all
              :props="{ label: 'menuName' }"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="success" @click="handlePermissionSubmit"
            >确定</el-button
          ></template
        >
      </el-dialog>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table
        :data="roleList"
        row-key="_id"
        :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="240px">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="100"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "role",
  data() {
    return {
      queryForm: {
        roleName: "",
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
          },
        ],
      },
      roleForm: {},
      showModal: false,
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 180,
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            console.log(value);
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let name = this.actionMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      roleList: [],
      acution: "",
      pager: {
        total: 0,
        pageSize: 10,
      },
      showPermission: false,
      curRoleName: "",
      curRoleId: "",
      menuList: [],
      //菜单映射表
      actionMap: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async getRoleList() {
      let params = { ...this.roleForm, ...this.pager };
      let res = await this.$api.getRoleList(params);
      this.roleList = res.list;
      this.pager.total = res.page.total;
    },
    handleAdd() {
      this.showModal = true;
    },
    // 菜单列表初始化
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList();
        this.menuList = list.menuList;
        this.getCationMap(list.menuList);
      } catch (e) {
        throw new Error(e);
      }
    },
    //修改表单
    handleEdit(row) {
      this.showModal = true;
      this.$nextTick(() => {
        Object.assign(this.roleForm, row);
      });
    },
    //表单搜索
    hanndleQuery() {
      this.getRoleList();
    },
    //表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    //分页事件处理
    handleCurrentChange(current) {
      pager.pageNum = current;
    },
    //添加角色
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm } = this;
          let params = { ...roleForm };
          let res = await this.$api.roleAdd(params);
          if (res) {
            this.showModal = false;
            this.$message.success("创建成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          }
        }
      });
    },
    //弹框关闭
    handleClose() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },
    //删除信息
    async handleDelete(_id) {
      await this.$api.roleDelete(_id);
      this.$message.success("删除成功");
    },
    //设置权限
    handleOpenPermission(row) {
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      this.showPermission = true;
      let { checkedKeys } = row.permissionList;
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys);
      });
    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.tree.getCheckedNodes();
      console.log(nodes);
      let halfKeys = this.$refs.tree.getHalfCheckedKeys();
      console.log(halfKeys);
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.cheldren) {
          //按钮
          checkedKeys.push(node._id);
        } else {
          //菜单
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      console.log(params);
      await this.$api.roleupdate(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    },
    getCationMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.aciton) {
            acitonMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
  },
};
</script>

<style lang="scss">
</style>