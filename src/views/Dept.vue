<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm">
        <el-form-item>
          <el-input
            v-model="queryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList">查询</el-button>
          <el-button @click="handleRest('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen()">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'create' ? '创建部门' : '修改部门'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            :options="deptList"
            :show-all-levels="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select
            placeholder="请选择部门负责人"
            v-model="deptForm.userName"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            placeholder="请选择负责人邮箱"
            v-model="deptForm.userEmail"
            disabled
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClone">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "dept",
  data() {
    return {
      queryForm: {
        deptName: "",
      },
      columns: [
        { label: "部门名称", prop: "deptName" },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "upateTime",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
      ],
      pager: {
        total: 0,
        pageSize: 10,
      },
      deptList: [],
      action: "create",
      showModal: false,
      deptForm: {},
      rules: {
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
      userList: [],
    };
  },
  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    //获取部门列表
    async getDeptList() {
      let params = { ...this.pager, ...this.queryForm };
      let res = await this.$api.getDeptList(params);
      this.deptList = res;
    },
    async getUserList() {
      this.userList = await this.$api.getAllUserList();
    },
    //表单重置
    handleReset(form) {
      this.$ref[form].resetFields();
    },
    handleEdit(row) {
      this.action = "update";
      this.showModal = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
    async handleDel(row) {
      this.action = "del";
      let params = { id: row._id };
      await this.$api.deptdel(params);
      this.$message.success("操作成功");
      this.getDeptList();
    },
    handleOpen() {
      this.action = "create";
      this.showModal = true;
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");

      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
    //表单取消
    handleClone() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    //表单提提交
    async handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm };
          delete params.user;
          let res = await this.$api.deptCreate(params);
          if (res) {
            this.showModal = false;
            this.$message.success("创建成功");
            this.handleReset("dialogForm");
            this.getDeptList();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
</style>