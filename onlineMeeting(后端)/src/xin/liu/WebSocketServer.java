package xin.liu;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
 
/**
 * writer: holien
 * Time: 2017-08-01 13:00
 * Intent: webSocket服务器
 */
@ServerEndpoint("/webSocket/chat/{roomName}/{username}")
public class WebSocketServer {
 
    // 使用map来收集session，key为roomName，value为同一个房间的用户集合
    // concurrentMap的key不存在时报错，不是返回null
    private static final Map<String, Set<Session>> rooms = new ConcurrentHashMap();
    private static final Map<String, String> userNameList = new ConcurrentHashMap();
    @OnOpen
    public void connect(@PathParam("roomName") String roomName,@PathParam("username") String username, Session session) throws Exception {
        // 将session按照房间名来存储，将各个房间的用户隔离
        if (!rooms.containsKey(roomName)) {
            // 创建房间不存在时，创建房间
            Set<Session> room = new HashSet<Session>();
            // 添加用户
            room.add(session);
            rooms.put(roomName, room);
        } else {
            // 房间已存在，直接添加用户到相应的房间
            rooms.get(roomName).add(session);
        }
        System.out.println("a client has connected!");
    }
 
    @OnClose
    public void disConnect(@PathParam("roomName") String roomName,@PathParam("userName") String userName, Session session) {
        rooms.get(roomName).remove(session);
        System.out.println("a client has disconnected!");
    }
 
    @OnMessage
    public void receiveMsg(@PathParam("roomName") String roomName,@PathParam("username") String username,
                           String msg, Session session) throws Exception {
        //此处应该有html过滤：易混淆的是username实质为userID,roomName实质为meetingID
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	String sendTime = sdf.format(new Date());
    	try{
    		//把聊天信息存入数据库
    		ConnectionPool  connPool = ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
    		Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
    		Statement stateInsert = conn.createStatement();
    		String sqlInsert = "insert into groupchat values("+roomName+", "+username+", '"+msg+"', '"+sendTime+"')";
    		stateInsert.executeUpdate(sqlInsert);
    		stateInsert.close();
    		connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
    	} catch (SQLException e) {
    		e.printStackTrace();
    	}
    	GroupChat groupChat = new GroupChat();
    	groupChat.setMeetingID(Integer.parseInt(roomName));
    	groupChat.setUserID(Integer.parseInt(username));
    	groupChat.setMessage(msg);
    	groupChat.setSendTime(sendTime);
    	Gson gson = new Gson();
    	String json = gson.toJson(groupChat);
        //接收到信息后将信息进行json封装后进行广播
        broadcast(roomName, json);
    }
 
    // 按照房间名进行广播
    public static void broadcast(String roomName, String msg) throws Exception {
        for (Session session : rooms.get(roomName)) {
                session.getBasicRemote().sendText(msg);
        }
    }
 
}
