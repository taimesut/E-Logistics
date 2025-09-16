import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <Result
                status="404"
                title="404"
                subTitle="Không tìm thấy trang bạn đang tìm kiếm."
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                }
            />
        </div>
    );
};

export default NotFoundPage;
