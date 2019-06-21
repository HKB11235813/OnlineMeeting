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
import xin.liu.Domain;
import xin.liu.Meeting;

/**
 * Servlet implementation class domainServlet
 */
@WebServlet("/domainServlet")
public class domainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public domainServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//设置字符编码集
		response.addHeader("Access-Control-Allow-Origin","*");
        request.setCharacterEncoding("utf-8");
        //无需获取前台传来的数据请求，name为要查询的数据表
		String domainName = request.getParameter("domainName");
		String domainType = request.getParameter("domainType");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        ArrayList<Domain> domainList = new ArrayList<Domain>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "select * from userdomain where domainName like '%"+domainName+"%'";
			if(domainType.equals("meetingDomain")){
				sql = "select * from meetingdomain where domainName like '%"+domainName+"%'";
			}
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
            Statement stmt = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	Domain domain = new Domain();
	        	domain.setDomainID(rs.getInt("domainID"));
	        	domain.setDomainName(rs.getString("domainName"));
	        	domain.setCreateName(rs.getString("createName"));
	        	domain.setCreateTime(sdf.format(rs.getTimestamp("createTime")));
	        	domainList.add(domain);
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
		String json = gson.toJson(domainList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 	
	}

}
