import {User} from './types/user';
import {Verification} from './types/verification';
import {Connection, MysqlError, OkPacket} from 'mysql';

const mysql = require('mysql');

/**
 *
 */
export default class BD {
  private static instance: BD;
  private connection: Connection;

  /**
   *
   * @private
   */
  private constructor() {
    this.connection = mysql.createConnection({
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
      this.connection.query(
          'INSERT INTO `user` SET ?',
          {discord_id: discordId},
          (error: MysqlError, results: OkPacket) => {
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
  public getUser(discordId: String): Promise<User> {
    return new Promise((resolve, reject) => {
      this.connection.query(
          'SELECT * FROM user WHERE discord_id = ?',
          [discordId],
          (error: MysqlError, results: User) => {
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
  public checkVerification(userID: Number): Promise<Verification> {
    return new Promise((resolve, reject) => {
      this.connection.query(
          'SELECT * FROM verification WHERE user_id = ? ',
          [userID],
          (error: MysqlError, results: Verification) => {
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
  public addUserTag(userID: Number, tag: String): Promise<Verification> {
    return new Promise((resolve, reject) => {
      this.connection.query(
          'UPDATE user SET tag = ? WHERE id = ? ',
          [tag, userID],
          (error: MysqlError, results: OkPacket) => {
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
  public verifyUser(userID: Number): Promise<Verification> {
    return new Promise((resolve, reject) => {
      this.connection.query(
          'UPDATE user SET is_verify = TRUE WHERE id = ? ',
          [userID],
          (error: MysqlError, results: OkPacket) => {
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
      this.connection.query(
          'INSERT INTO verification (`user_id`) VALUES (?)',
          [userId],
          (error: MysqlError, results: OkPacket) => {
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
      this.connection.query(
          'DELETE FROM verification WHERE user_id = ?',
          [userId],
          (error: MysqlError, results: OkPacket) => {
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
