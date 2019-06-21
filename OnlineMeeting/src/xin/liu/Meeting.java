package xin.liu;

public class Meeting {
	private int meetingID;
	private int meetingThemeID;
	private int participantsNum;
	public int getParticipantsNum() {
		return participantsNum;
	}
	public void setParticipantsNum(int participantsNum) {
		this.participantsNum = participantsNum;
	}
	private String meetingStatus;
	private String meetingDomain;
	private String meetingName;
	private String meetingIntro;
	private String meetingTheme;
	private String meetingAddress;
	private String meetingKeyword;
	private String host;
	private String startTime;
	private String endTime;
	private String creatThemeTime;
	private String updateThemeTime;
	public String getUpdateThemeTime() {
		return updateThemeTime;
	}
	public void setUpdateThemeTime(String updateThemeTime) {
		this.updateThemeTime = updateThemeTime;
	}
	private String documentName;
	private String themeAuthor;
	
	public int getMeetingThemeID() {
		return meetingThemeID;
	}
	public void setMeetingThemeID(int meetingThemeID) {
		this.meetingThemeID = meetingThemeID;
	}
	public String getCreatThemeTime() {
		return creatThemeTime;
	}
	public void setCreatThemeTime(String creatThemeTime) {
		this.creatThemeTime = creatThemeTime;
	}
	public String getDocumentName() {
		return documentName;
	}
	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}
	public String getThemeAuthor() {
		return themeAuthor;
	}
	public void setThemeAuthor(String themeAuthor) {
		this.themeAuthor = themeAuthor;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public int getMeetingID() {
		return meetingID;
	}
	public void setMeetingID(int meetingID) {
		this.meetingID = meetingID;
	}
	public String getMeetingStatus() {
		return meetingStatus;
	}
	public void setMeetingStatus(String meetingStatus) {
		this.meetingStatus = meetingStatus;
	}
	public String getMeetingDomain() {
		return meetingDomain;
	}
	public void setMeetingDomain(String meetingDomain) {
		this.meetingDomain = meetingDomain;
	}
	public String getMeetingName() {
		return meetingName;
	}
	public void setMeetingName(String meetingName) {
		this.meetingName = meetingName;
	}
	public String getMeetingIntro() {
		return meetingIntro;
	}
	public void setMeetingIntro(String meetingIntro) {
		this.meetingIntro = meetingIntro;
	}
	public String getMeetingTheme() {
		return meetingTheme;
	}
	public void setMeetingTheme(String meetingTheme) {
		this.meetingTheme = meetingTheme;
	}
	public String getMeetingAddress() {
		return meetingAddress;
	}
	public void setMeetingAddress(String meetingAddress) {
		this.meetingAddress = meetingAddress;
	}
	public String getMeetingKeyword() {
		return meetingKeyword;
	}
	public void setMeetingKeyword(String meetingKeyword) {
		this.meetingKeyword = meetingKeyword;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
}
