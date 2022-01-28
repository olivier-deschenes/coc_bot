import user from './types/user';
import verification from './types/verification';

const mysql = require('mysql');

/**
 *
 */
export default class BD {
  private static instance: BD;
  private connexion;

  /**
   *
   * @private
   */
  private constructor() {
    this.connexion = mysql.createConnection({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  /**
   * @return {BD} The instance
   */
  static getInstance() {
    if (!BD.instance) {
      this.instance = new BD();
    }

    return this.instance;
  }

  /**
   *
   * @param {String} discordId
   *
   * @return {Promise} The created user
   */
  public createUser(discordId: String) {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'INSERT INTO `user` SET ?',
          {discord_id: discordId},
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
      );
    });
  }

  /**
   *
   * @param {String} discordId
   *
   * @return {Promise} The created user
   */
  public getUser(discordId: String): Promise<user> {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'SELECT * FROM user WHERE discord_id = ?',
          [discordId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }

  /**
     *
     * @param {String} userID
     *
     * @return {Promise} The created user
     */
  public checkVerification(userID: Number): Promise<verification> {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'SELECT * FROM verification WHERE user_id = ? ',
          [userID],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }

  /**
     *
     * @param {String} userID
     * @param {String} tag
     *
     * @return {Promise} The created user
     */
  public addUserTag(userID: Number, tag: String): Promise<verification> {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'UPDATE user SET tag = ? WHERE id = ? ',
          [tag, userID],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }

  /**
     *
     * @param {String} userID
     *
     * @return {Promise} The created user
     */
  public verifyUser(userID: Number): Promise<verification> {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'UPDATE user SET is_verify = TRUE WHERE id = ? ',
          [userID],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }

  /**
   *
   * @param {String} userId
   *
   * @return {Promise}
   */
  public createVerification(userId: Number) {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'INSERT INTO verification (`user_id`) VALUES (?)',
          [userId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }

  /**
     *
     * @param {String} userId
     *
     * @return {Promise}
     */
  public deleteVerification(userId: Number) {
    return new Promise((resolve, reject) => {
      this.connexion.query(
          'DELETE FROM verification WHERE user_id = ?',
          [userId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          }
      );
    });
  }
}
