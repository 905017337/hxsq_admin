<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户名称" hide-required-asterisk prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
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
          :model="userForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="用户名" hide-required-asterisk prop="username">
            <el-input
              v-model="userForm.username"
              :disabled="action == 'edit'"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="邮  箱" prop="userEmail">
            <el-input
              v-model="userForm.userEmail"
              hide-required-asterisk
              :disabled="action == 'edit'"
              placeholder="请输入用户邮箱"
            >
              <template #append>@qq.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="岗  位" prop="job">
            <el-input v-model="userForm.job" placeholder="请输入岗位" />
          </el-form-item>
          <el-form-item label="状  态" prop="state">
            <el-select v-model="userForm.state" placeholder="请选择用户状态">
              <el-option :value="0" label="在职" />
              <el-option :value="1" label="离职" />
              <el-option :value="2" label="试用期" />
            </el-select>
          </el-form-item>
          <el-form-item label="系统权限" prop="roleList">
            <el-select
              v-model="userForm.roleList"
              placeholder="请选择用户对应角色"
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="dept in roleList"
                :key="dept._id"
                :label="dept.roleName"
                :value="dept._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-cascader
              v-model="userForm.deptId"
              placeholder="请选择所属部门"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- #footer 插槽 -->
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
        <el-button type="primary" @click="handlecreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150px">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
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
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
export default {
  name: "user",
  setup() {
    //获取composition API上下文对象
    const { proxy } = getCurrentInstance();
    //初始化用户表单对象
    const user = reactive({
      state: 0,
    });
    //初始化用户列表数据
    const userList = ref([]);
    //初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    //用户选择的列表对象
    const checkedUserIds = ref([]);
    //弹框显示对象
    const showModal = ref(false);
    //定义动态表格-格式
    const columns = reactive([
      {
        label: "用户id",
        prop: "userId",
      },
      {
        label: "用户名称",
        prop: "username",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            2: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    //初始化接口调用
    onMounted(() => {
      getUserList();
      //部门列表
      getDeptList();
      //角色列表
      getRoleList();
    });
    //查询事件 获取用户列表
    const hanndleQuery = () => {
      getUserList();
    };
    //用户操作行为
    const action = ref("add");
    //重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    //新增用户FORM对象
    const userForm = reactive({
      state: 2,
    });
    //角色列表
    const roleList = ref([]);
    //部门列表
    const deptList = ref([]);
    //定义表单校验规则
    const rules = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1\d{10}/,
          message: "请输入正确的手机号",
          tirgger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur",
        },
      ],
    });
    //获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, pageNum, pageSize, total } = await proxy.$api.getUserList(
          params
        ); //添加参数
        console.log(list);
        userList.value = list;
        pager.total = total;
        pager.pageNum = pageNum;
        pager.pageSize = pageSize;
      } catch (error) {
        console.log(error);
      }
    };
    //分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
    };
    //获取部门列表
    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList();
      deptList.value = list;
    };
    //获取角色列表
    const getRoleList = async () => {
      let list = await proxy.$api.getRoleAllList();
      roleList.value = list;
    };

    //删除事件处理
    const handleDelete = async (row) => {
      await proxy.$api.userDel({
        userIds: [row.userId],
      });
      proxy.$message.success("删除成功");
      getUserList();
    };

    //批量删除
    const handlePatchDel = async () => {
      //判断用户选择的个数
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value, //课可单个删除 也可以批量删除
      });
      if (res.nModified > 0) {
        getUserList();
        proxy.$message.success("删除成功");
      } else {
        proxy.$message.error("删除失败");
      }
    };
    //表格多选
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };
    //用户新增
    const handlecreate = async () => {
      action.value = "add";
      showModal.value = true;
      //   const res = proxy.$api.userAdd();
    };
    //用户弹框关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    //用户提交
    const handleSubmit = () => {
      action.value = "add";
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          //校验通过
          let params = toRaw(userForm);
          params.userEmail += "qq.com";
          let res = await proxy.$api.userSubmit(params);
          console.log(res);
          if (res) {
            showModal.value = false;
            proxy.$message.success("用户创建成功");
            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };
    //用户编辑
    const handleEdit = (row) => {
      action.value = "edit";
      console.log(action.value);
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      getUserList,
      hanndleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDel,
      handleSelectionChange,
      handlecreate,
      getRoleList,
      handleClose,
      handleSubmit,
      handleEdit,
    };
  },
};
</script>

<style lang="scss">
</style>