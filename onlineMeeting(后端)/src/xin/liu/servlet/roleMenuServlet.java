package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.GetIpAddress;
import xin.liu.User;
import xin.liu.loginLog;

/**
 * Servlet implementation class roleMenuServlet
 */
@WebServlet("/roleMenuServlet")
public class roleMenuServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public roleMenuServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(request, response);
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
		String roleID = request.getParameter("roleID");
		String selectRoleName = request.getParameter("selectRoleName");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        ArrayList<String> menuClassList = new ArrayList<String>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "SELECT * FROM role_menu left join menupermission on "
	        		+ "role_menu.menuPermissionID=menupermission.menuPermissionID "
	        		+ "WHERE roleID='"+ roleID + "'";
			String strName = "menuClass";
	        if(selectRoleName!=null){
	        	sql = "SELECT * FROM role_menu left join menupermission on "
		        		+ "role_menu.menuPermissionID=menupermission.menuPermissionID "
	        			+ "left join role on role_menu.roleID=role.roleID "
		        		+ "WHERE roleName= '"+ selectRoleName + "'";
	        	strName = "menuName";
	        }
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
            Statement stmt = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
	        while(rs.next()){
	        	menuClassList.add(rs.getString(strName));
	        }
            //使用完数据库池释放
            rs.close();
            stmt.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(menuClassList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
