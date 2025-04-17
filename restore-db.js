const { pool } = require('./database');
const fs = require('fs').promises;

async function restoreDatabase(backupFilePath) {
    let connection;
    let retryCount = 0;
    const maxRetries = 3; // 將最大重試次數恢復為一個合理的固定值
    let executedStatements = 0;
    let sqlStatements = [];
    let lastError = null; // 聲明 lastError 變數
    let lasttrimmedStatement = null;

    console.log(`開始還原資料庫，檔案路徑: ${backupFilePath}`);

    try {
        const sqlContent = await fs.readFile(backupFilePath, 'utf8');
        // sqlStatements = sqlContent.split(/;\s*\n/).filter(stmt => stmt.trim() !== '' && !stmt.trim().match(/^--/));
        sqlStatements = sqlContent.split(/;\s*\n/).filter(stmt => stmt.trim() !== '' && !stmt.trim().match(/^--/));

        console.log(`找到 ${sqlStatements.length} 個 SQL 語句。`);

        while (retryCount < maxRetries) {
            try {
                connection = await pool.getConnection();
                await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
                console.log('已禁用外鍵約束檢查。');

                for (let i = executedStatements; i < sqlStatements.length; i++) {
                    const trimmedStatement = sqlStatements[i].trim();
                    if (trimmedStatement) { // 確保 trimmedStatement 不為空
                        console.log(`執行 SQL 語句 (${i + 1}/${sqlStatements.length}): ${trimmedStatement.substring(0, 50)}...`);
                        lasttrimmedStatement = trimmedStatement;
                        executedStatements = i + 1;
                        await connection.execute(trimmedStatement);
                    }
                }

                await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
                console.log('已重新啟用外鍵約束檢查。');
                console.log('資料庫還原完成！');
                break;

            } catch (error) {
                lastError = error;
                console.error('執行 SQL 語句時發生錯誤:', error);
                console.error('導致錯誤的 SQL 語句:', lasttrimmedStatement);
                if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error(`嘗試 ${retryCount + 1} 還原資料庫時發生錯誤:`, error);
                    console.log('連接斷開，嘗試重新連接...');
                    retryCount++;
                    if (connection) {
                        connection.release();
                        connection = null;
                    }
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else if (error.code === 'ER_DUP_ENTRY') {
                    console.warn('發現重複記錄，已忽略:', lasttrimmedStatement);
                } else {
                    console.error('發生其他 SQL 錯誤，還原失敗。');
                    break;
                }
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        }

        if (retryCount >= maxRetries) {
            console.error('達到最大重試次數，還原失敗。');
            if (lastError) {
                console.error('最後一個錯誤:', lastError);
            }
        }

    } catch (error) {
        console.error('讀取備份檔案時發生錯誤:', error);
    }
}

// 如果你想在腳本執行時直接指定備份檔案路徑，可以這樣做：
const backupFileToRestore = process.argv[2]; // 從命令列參數取得備份檔案路徑

if (backupFileToRestore) {
    restoreDatabase(backupFileToRestore);
} else {
    console.log('請提供備份檔案路徑作為命令列參數。例如：node restore-db.js ./backups/your_backup.sql');
}