<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="QueryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="QueryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" hide-required-asterisk prop="menuState">
          <el-select v-model="QueryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="hanndleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="新增用户" v-model="showModal">
        <el-form
          ref="dialogForm"
          :model="menuForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="父级菜单" hide-required-asterisk prop="parentId">
            <el-cascader
              v-model="menuForm.parentId"
              :show-all-levels="false"
              :options="menuList"
              :props="{
                checkStrictly: true,
                value: 'menuCode',
                label: 'menuName',
                emitPath: false,
              }"
              clearable
            />
            <span>不选，则直接创建一级菜单</span>
          </el-form-item>
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="menuForm.menuType">
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="menuForm.menuName"
              placeholder="请输入菜单名称"
            />
          </el-form-item>
          <el-form-item
            label="菜单图标"
            prop="icon"
            v-show="menuForm.menuType == 1"
          >
            <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
          </el-form-item>
          <el-form-item
            label="路由地址"
            prop="path"
            v-show="menuForm.menuType == 1"
          >
            <el-input v-model="menuForm.path" placeholder="请选择路由地址" />
          </el-form-item>
          <el-form-item
            label="权限标识"
            prop="menuCode"
            v-show="menuForm.menuType == 2"
          >
            <el-input
              v-model="menuForm.menuCode"
              placeholder="请输入权限标识"
            />
          </el-form-item>
          <el-form-item
            label="组件路径"
            prop="component"
            v-show="menuForm.menuType == 1"
          >
            <el-input
              v-model="menuForm.component"
              placeholder="请输入组件路径"
            />
          </el-form-item>
          <el-form-item
            label="菜单状态"
            prop="menuState"
            v-show="menuForm.menuType == 1"
          >
            <el-radio-group v-model="menuForm.menuState">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="success" @click="handleSubmit"
            >确定</el-button
          ></template
        >
      </el-dialog>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="id"
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
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "jmMenu",
  data() {
    return {
      QueryForm: {
        menuName: "",
        menuState: "",
      },
      menuForm: {
        parentId: "",
        menuState: 1,
        menuType: 1,
      },
      showModal: false,
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 180,
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
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
      action: "",
      pager: {
        total: 0,
        pageSize: 10,
      },
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      let params = { ...this.pager, ...this.QueryForm };
      let res = await this.$api.getMenuList(params);
      this.menuList = res;
    },
    //表单搜索
    hanndleQuery() {
      this.getMenuList();
    },
    //表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    //菜单添加
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row.id].filter(
          (item) => item
        );
      }
    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";

      this.$nextTick(() => {
        Object.assign(this.menuForm, row);
      });
    },
    async handleDelete(id) {
      this.menuForm.id = id;
      let params = { ...this.menuForm };
      await this.$api.menuDel(params);
      this.showModal = false;
      this.$message.success("删除成功");
      this.getMenuList();
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    //添加提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { menuForm } = this;
          let params = { ...menuForm };
          let res = null;
          console.log(this.action);
          if (this.action == "add") {
            res = await this.$api.menuAdd(params);
          } else if (this.action == "edit") {
            res = await this.$api.menuUpdate(params);
          }
          if (res) {
            this.$message.success("添加成功");
            this.showModal = false;
            this.handleReset("dialogForm");
            this.getMenuList();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
</style>