package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;

/**
 * Servlet implementation class editMenuServlet
 */
@WebServlet("/editMenuServlet")
public class editMenuServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public editMenuServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//设置字符编码集
		response.addHeader("Access-Control-Allow-Origin","*");
	    request.setCharacterEncoding("utf-8");
	    //获取前台传来的数据请求，name为要查询的数据表
	    String selectRoleName = request.getParameter("selectRoleName");
		String menuPermissionID = request.getParameter("menuPermissionID");
		String[] menuList = menuPermissionID.split(",");
	    //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
	    response.setCharacterEncoding("utf-8");
	    response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    String addResultFrontMeesage = "";
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        String sqlQuery = "select * from role where roleName='"+selectRoleName+"'";
	        
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stateInsert = conn.createStatement();
	        Statement statement = conn.createStatement();
	        ResultSet resultQuery = statement.executeQuery(sqlQuery);
	        //先找出来这个要编辑角色的ID
	        int roleID = 0;
	        resultQuery.next();
	        roleID = resultQuery.getInt(1);
        	//在表role_menu中删除所有有关roleID的全部功能
        	String sqlDel = "delete from role_menu where roleID = '"+roleID+"'";
	        stateInsert.executeUpdate(sqlDel);
	        //删除完旧功能后需要添加新的菜单权限
	        for(int i=0;i<menuList.length;i++){
	        	String sqlMenuInsert = "insert into role_menu values ('"+roleID+"', '"+menuList[i]+"')";
	        	stateInsert.executeUpdate(sqlMenuInsert);
	        }
	        addResultFrontMeesage = "权限菜单修改成功!";
	        //使用完数据库池释放
	        statement.close();
            resultQuery.close();
	        stateInsert.close();
	        connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(addResultFrontMeesage);
	    out.print(json);
	    out.flush();//刷新流
	    out.close();//关闭流 
	}

}
