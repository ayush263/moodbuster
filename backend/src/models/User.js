/**
 * User data model/schema
 * Handles user profile and authentication information
 */

class User {
  constructor(id, email, name, createdAt) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt || new Date();
    this.preferences = {
      notifications: true,
      shareData: false,
      language: 'en'
    };
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      preferences: this.preferences
    };
  }
}

module.exports = User;
