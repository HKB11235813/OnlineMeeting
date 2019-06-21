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
import xin.liu.Meeting;

/**
 * Servlet implementation class meetingAbstractServlet
 */
@WebServlet("/meetingAbstractServlet")
public class meetingAbstractServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public meetingAbstractServlet() {
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
        String themeName = request.getParameter("themeName");
        String meetingName = request.getParameter("meetingName");
        String updateTime = request.getParameter("updateTime");
        String endTime = request.getParameter("endTime");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        ArrayList<Meeting> meetingList = new ArrayList<Meeting>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
	        String sql = "select * from meetingtheme join meeting on meetingtheme.meetingThemeID=meeting.meetingThemeID "
	        		+ "where themeName like '%"+themeName+"%' and meetingName like '%"+meetingName+"%' "
	        		+ "and updateTime like '%"+updateTime+"%' and endTime like '%"+endTime+"%'"
	        		+ "order by meetingtheme.meetingThemeID";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
            Statement stmt = conn.createStatement();
            Statement statement = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	Meeting meeting = new Meeting();
	        	meeting.setMeetingTheme(rs.getString("themeName"));
	        	meeting.setMeetingName(rs.getString("meetingName"));
	        	meeting.setCreatThemeTime(sdf2.format(rs.getDate("createTime")));
	        	meeting.setDocumentName(rs.getString("documentName"));
	        	meeting.setUpdateThemeTime(sdf2.format(rs.getDate("updateTime")));
	        	meeting.setThemeAuthor(rs.getString("author"));
	        	meeting.setMeetingID(rs.getInt("meetingID"));
	        	meeting.setMeetingThemeID(rs.getInt("meetingThemeID"));
	        	meetingList.add(meeting);
            }
	        
	        /***************设置操作日志**************
    		 *1.获取姓名 
    		 *2.获取操作时间
    		 *3.获取参数
    		 *************************************/
	        String userName = request.getParameter("userName");
    		String operateTime = sdf.format(new Date());
    		String module = "会议管理";
    		String operate = "查看会议纪要";
    		String parameter = "name="+userName;
    		sql = "INSERT INTO businesslog VALUES ('"+userName+"', '"+operateTime+"', '"+module+"', '"+operate+"', '"+parameter+"')";
    		statement.executeUpdate(sql);
	        
	        
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
		String json = gson.toJson(meetingList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
