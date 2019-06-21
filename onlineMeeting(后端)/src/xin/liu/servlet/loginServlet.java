package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Pattern;

import xin.liu.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class loginServlet
 */
@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
    public loginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
		String username = request.getParameter("username");
		String password = request.getParameter("password");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		User user = new User();
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
	        String sql = "SELECT * FROM user WHERE username='"
							+ username + "'";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
            Statement stmt = conn.createStatement();
            Statement statement = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        if(!rs.next()){
	        	//若为空则用户不存在，没有查询到
	        	user.setUserJudge(0);
            }else{
            	//若用户存在再判断密码是否正确
            	if(rs.getString("password").equals(password)){
	        		//账号密码正确后登录
            		user.setUserJudge(2);
            		/*正确登录后进行日志记录插入数据库
            		 *1.获取姓名 
            		 *2.获取时间
            		 *3.获取IP地址
            		 **/
            		GetIpAddress getIP = new GetIpAddress();
            		String loginIp = getIP.getIpAddress(request);
            		String loginTime = sdf.format(new Date());
            		sql = "INSERT INTO loginlog VALUES ('"+rs.getString("name")+"', '"+loginTime+"', '"+loginIp+"')";
            		statement.executeUpdate(sql);
            		
            		//常规操作
            		sql = "select * from user join role"
        					+ " on user.roleID = role.roleID where userID="+rs.getInt("userID");
            		rs = stmt.executeQuery(sql);
            		rs.next();
            		user.setName(rs.getString("name"));
            		user.setUserID(rs.getInt("userID"));
            		user.setRoleName(rs.getString("roleName"));
            		user.setRoleID(rs.getInt("roleID"));
				}else{
					//不正确返回不正确的信息
					user.setUserJudge(1);
				}
            }
            //使用完数据库池释放
            rs.close();
            stmt.close();
            statement.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(user);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 	
	}
}
