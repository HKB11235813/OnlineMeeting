package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.User;

/**
 * Servlet implementation class userManageServlet
 */
@WebServlet("/userManageServlet")
public class userManageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public userManageServlet() {
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
        int currentPage = Integer.parseInt(request.getParameter("currentPage"));
        String name = request.getParameter("userName");
        String role = request.getParameter("role");
        String domain = request.getParameter("domain");
        String status = request.getParameter("status");
        String createTime = request.getParameter("createTime");
        String endTime = request.getParameter("endTime");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        ArrayList<User> userList = new ArrayList<User>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "SELECT * FROM user left join userdomain on user.domianID=userdomain.domainID "
					+ "left join status on user.statusID=status.statusID "
					+ "left join role on user.roleID=role.roleID "
					+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
					+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
	        		+ "limit "+((currentPage-1)*5)+","+(currentPage*5);
	        String sqlStr = "select count(*) from user left join userdomain on user.domianID=userdomain.domainID "
					+ "left join status on user.statusID=status.statusID "
					+ "left join role on user.roleID=role.roleID "
					+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
					+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' ";
			
	        
	        if(createTime!="" && endTime!=""){
				sql = "SELECT * FROM user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime between '"+createTime+"' and '"+endTime+"'"
		        		+ "limit "+((currentPage-1)*5)+","+(currentPage*5);
				
		        sqlStr = "select count(*) from user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime between '"+createTime+"' and '"+endTime+"'";
		        
			}else if(createTime!=""&&endTime==""){
				sql = "SELECT * FROM user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime >= '"+createTime+"'"
		        		+ "limit "+((currentPage-1)*5)+","+(currentPage*5);
		        sqlStr = "select count(*) from user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime >= '"+createTime+"'";
		        
			}else if(createTime==""&&endTime!=""){
				sql = "SELECT * FROM user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime <= '"+endTime+"'"
		        		+ "limit "+((currentPage-1)*5)+","+(currentPage*5);
		        sqlStr = "select count(*) from user left join userdomain on user.domianID=userdomain.domainID "
						+ "left join status on user.statusID=status.statusID "
						+ "left join role on user.roleID=role.roleID "
						+ "where name like '%"+name+"%' and roleName like '%"+role+"%' "
						+ "and domainName like '%"+domain+"%' and statusName like '%"+status+"%' "
						+ "and user.createTime <= '"+endTime+"'";
			}
	        
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement statement = conn.createStatement();
            ResultSet result = statement.executeQuery(sqlStr);
            int totalRecord=0,totalPage=0;
            if(result.next()){
            	totalRecord = result.getInt(1);
            	totalPage = totalRecord/5;
            	if(totalRecord%5!=0){
            		totalPage++;
            	}
            }
            
            Statement stmt = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	User user = new User();
	        	user.setUserID(rs.getInt("userID"));
	        	user.setUsername(rs.getString("username"));
	        	user.setName(rs.getString("name"));
	        	user.setTellphone(rs.getString("tellphone"));
	        	user.setEmail(rs.getString("email"));
	        	user.setDomain(rs.getString("domainName"));
	        	user.setStatus(rs.getString("statusName"));
	        	user.setRoleName(rs.getString("roleName"));
	        	user.setCreateTime(sdf.format(rs.getDate("createTime")));
	        	user.setTotalPage(totalPage);
	        	user.setTotalRecord(totalRecord);
	        	userList.add(user);
            }
	        
            //使用完数据库池释放
	        result.close();
	        statement.close();
            rs.close();
            stmt.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(userList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
