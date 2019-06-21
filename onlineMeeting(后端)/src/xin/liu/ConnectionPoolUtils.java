package xin.liu;

public class ConnectionPoolUtils {
	private static Object lock = new Object();
	private static ConnectionPool poolInstance = null;
    public static ConnectionPool GetPoolInstance() {
        if (poolInstance == null) {
            synchronized (lock) {
                if (poolInstance == null) {
                    poolInstance = new ConnectionPool(
                            "com.mysql.jdbc.Driver",
                            "jdbc:mysql://localhost:3306/onlinemeeting?useUnicode=true&characterEncoding=utf-8",
                            "root", "root");
                    try {
                        poolInstance.createPool();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            }
        }
       return poolInstance;
    }
}
