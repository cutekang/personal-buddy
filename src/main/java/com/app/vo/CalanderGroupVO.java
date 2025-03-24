package com.app.vo;

import java.util.Objects;

public class CalanderGroupVO {
	private Long id;
	private Long userGroupId;
	
	public CalanderGroupVO() {;}

	@Override
	public String toString() {
		return "CalanderGroupVO [id=" + id + ", userGroupId=" + userGroupId + "]";
	}

	public CalanderGroupVO(Long id, Long userGroupId) {
		super();
		this.id = id;
		this.userGroupId = userGroupId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserGroupId() {
		return userGroupId;
	}

	public void setUserGroupId(Long userGroupId) {
		this.userGroupId = userGroupId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, userGroupId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CalanderGroupVO other = (CalanderGroupVO) obj;
		return Objects.equals(id, other.id) && Objects.equals(userGroupId, other.userGroupId);
	}
	
	
}
