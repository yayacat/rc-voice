const { pool } = require('./database');
const fs = require('fs').promises;

async function restoreDatabase(backupFilePath) {
    let connection;
    let retryCount = 0;
    let maxRetries = 3;
    let executedStatements = 0;

    console.log(`開始還原資料庫，檔案路徑: ${backupFilePath}`);

    const sqlContent = await fs.readFile(backupFilePath, 'utf8');
    const sqlStatements = sqlContent.split(/;\s*\n/).filter(stmt => stmt.trim() !== '' && !stmt.trim().match(/^--/));

    console.log(`找到 ${sqlStatements.length} 個 SQL 語句。`);
    maxRetries = sqlStatements.length;
    while (retryCount < maxRetries) {
        try {
            connection = await pool.getConnection();
            await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
            console.log('已禁用外鍵約束檢查。');

            for (let i = executedStatements; i < sqlStatements.length; i++) {
                const trimmedStatement = sqlStatements[i].trim();
                console.log(`執行 SQL 語句 (${i + 1}/${sqlStatements.length}): ${trimmedStatement.substring(0, 50)}...`);
                await connection.execute(trimmedStatement);
                executedStatements = i + 1;
            }

            await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
            console.log('已重新啟用外鍵約束檢查。');
            console.log('資料庫還原完成！');
            break;

        } catch (error) {
            console.error(`嘗試 ${retryCount + 1} 還原資料庫時發生錯誤:`, error);
            if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('連接斷開，嘗試重新連接...');
                retryCount++;
                if (connection) {
                    connection.release();
                    connection = null;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.error('發生非連接斷開錯誤，還原失敗。');
                break;
            }
        } finally {
            if (connection && error?.code !== 'PROTOCOL_CONNECTION_LOST') {
                connection.release();
            }
        }
    }

    if (retryCount >= maxRetries) {
        console.error('達到最大重試次數，還原失敗。');
    }
}

// 如果你想在腳本執行時直接指定備份檔案路徑，可以這樣做：
const backupFileToRestore = process.argv[2]; // 從命令列參數取得備份檔案路徑

if (backupFileToRestore) {
    restoreDatabase(backupFileToRestore);
} else {
    console.log('請提供備份檔案路徑作為命令列參數。例如：node restore-db.js ./backups/your_backup.sql');
}